const express = require('express');
const router = express.Router();
const { ResponseHandler, asyncHandler } = require('../utils/ResponseHandler');
const UserService = require('../services/UserService');
const NameplateService = require('../services/NameplateService');
const RankingService = require('../services/RankingService');
//const { broadcast } = require('../utils');

/**
 * Gacha pull types, keyed by pull_type. Each entry owns its own pull logic
 * and response shape, plus a getPullWeight so 'all' can weight pools against
 * each other using their spawn_weight totals. Add new entries here (e.g. title)
 * as those item types come online — no new route needed.
 */
const gachaHandlers = {
  nameplate: {
    getPullWeight: (isPremium) => NameplateService.getPullWeight(isPremium),
    pull: async (res, user, isPremium, pullType) => {
      const pulledNameplate = await NameplateService.performGacha(isPremium);
      const wasIssued = await NameplateService.addNameplateToUser(user.id, pulledNameplate.id);

      const response = {
        pull_type: pullType,
        pulled_nameplate_name: pulledNameplate.sysname,
        previous_active_nameplate: user.equipped.nameplate.sysname
      };

      // New nameplate successfully issued
      if (wasIssued) {
        await UserService.updateStat(user.id, 'card_gacha_pulls_success', 1, true);

        return ResponseHandler.success(res, {
          ...response,
          success: true,
          is_new: true
        },
          `You pulled a ${pulledNameplate.is_premium ? 'Premium ' : ''}[${pulledNameplate.name}] Nameplate! ` +
          `It's now your active nameplate!`
        );
      }

      // Got "Try Again" nameplate
      if (pulledNameplate.sysname === 'try-again') {
        return ResponseHandler.success(res, {
          ...response,
          success: false,
          is_new: false,
          reason: 'TRY_AGAIN'
        }, 'Sorry! Try again!');
      }

      // Already owned nameplate (duplicate)
      return ResponseHandler.success(res, {
        ...response,
        success: false,
        is_new: false,
        reason: 'DUPLICATE'
      },
        `You pulled a ${pulledNameplate.is_premium ? 'Premium ' : ''}[${pulledNameplate.name}] Nameplate! ` +
        `You already have this nameplate.`
      );
    }
  }
  // future:
  // title: {
  //   getPullWeight: (isPremium) => TitleService.getPullWeight(isPremium),
  //   pull: async (res, user, isPremium, pullType) => { ... }
  // }
};

/**
 * Pick a gacha pull type at random, weighted by each type's total spawn_weight
 * pool (e.g. SUM(spawn_weight) across tbl_nameplates, tbl_titles, etc.)
 */
async function pickWeightedPullType(types, isPremium) {
  const weights = await Promise.all(
    types.map(type => gachaHandlers[type].getPullWeight(isPremium))
  );

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Fallback to a uniform pick if nothing has spawn weight configured
  if (!totalWeight) {
    return types[Math.floor(Math.random() * types.length)];
  }

  let random = Math.random() * totalWeight;
  for (let i = 0; i < types.length; i++) {
    random -= weights[i];
    if (random <= 0) return types[i];
  }

  return types[types.length - 1]; // floating-point edge case fallback
}

/**
 * POST /mainframe/login-widget
 * User login via Mainframe website Widget
 */
router.post('/login-widget', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_avatar } = req.body;

  if (!twitch_id || !twitch_display_name) {
    return ResponseHandler.validationError(res, {
      twitch_id: 'Required',
      twitch_display_name: 'Required'
    });
  }

  const user = await UserService.getUserByTwitchId(
    twitch_id,
    twitch_display_name,
    twitch_avatar
  );

  console.log(`User data: ${JSON.stringify(user)}`);

  await UserService.updateTimestamp(user.id, 'last_login');

  return ResponseHandler.success(res, user, 'Login successful');
}));

/**
 * POST /mainframe/check-in
 * Stream check-in
 */
router.post('/check-in', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_avatar, twitch_roles, checkin_count } = req.body;

  const isPremium = UserService.isPremium(twitch_roles);
  const user = await UserService.getUserByTwitchId(
    twitch_id,
    twitch_display_name,
    twitch_avatar,
    isPremium
  );

  // Award EXP
  await UserService.awardExp(user.id, isPremium, 1);

  // Update stats
  await UserService.updateStat(user.id, 'checkin_count', checkin_count, false);
  await UserService.updateTimestamp(user.id, 'last_checkin');

  // Check achievements
  const achievement = await UserService.checkAchievements(user.id, 'checkin_count');

  return ResponseHandler.success(res, {
    twitch_id: user.twitch_id,
    local_id: user.id,
    level: user.level,
    is_premium: isPremium,
    active_nameplate_name: user.equipped.nameplate.sysname,
    active_nameplate_title: (user.equipped.nameplate.is_premium ? 'Premium ' : '') + user.equipped.nameplate.name,
    has_achievement: !!achievement,
    achievement
  }, 'Check-in successful');
}));

/**
 * POST /mainframe/gacha
 * Perform a gacha pull. pull_type selects the item pool (default: nameplate).
 * pull_type: 'all' picks a pool at random, weighted by each pool's total
 * spawn_weight — useful if these end up sharing one Twitch redeem.
 */
router.post('/gacha', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar, pull_type = 'all' } = req.body;

  const pullableTypes = Object.keys(gachaHandlers);
  const isPremium = UserService.isPremium(twitch_roles);

  const resolvedType = pull_type === 'all'
    ? await pickWeightedPullType(pullableTypes, isPremium)
    : pull_type;

  const handler = gachaHandlers[resolvedType];
  if (!handler) {
    return ResponseHandler.validationError(res, {
      pull_type: `Must be one of: ${[...pullableTypes, 'all'].join(', ')}`
    });
  }

  const user = await UserService.getUserByTwitchId(
    twitch_id,
    twitch_display_name,
    twitch_avatar,
    isPremium
  );

  return handler.pull(res, user, isPremium, resolvedType);
}));

/**
 * POST /mainframe/change-nameplate
 * Change active nameplate
 */
router.post('/change-nameplate', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_avatar, new_nameplate_name } = req.body;

  const user = await UserService.getUserByTwitchId(
    twitch_id,
    twitch_display_name,
    twitch_avatar
  );

  if (user.equipped.nameplate.sysname === new_nameplate_name) {
    return ResponseHandler.error(res, "You're already using this nameplate.", 400);
  }

  const targetNameplate = user.nameplates.find(nameplate => nameplate.sysname === new_nameplate_name);

  if (!targetNameplate) {
    return ResponseHandler.error(res,
      "Nameplate not found in your collection. Type !getnp to see available nameplates.",
      404
    );
  }

  await NameplateService.setActiveNameplate(user.id, targetNameplate.id);

  return ResponseHandler.success(res, { active_nameplate: targetNameplate.sysname },
    `You are now using your ${targetNameplate.is_premium ? 'Premium ' : ''}${targetNameplate.name} Nameplate!`
  );
}));

/**
 * POST /mainframe/get-nameplates
 * Get user's nameplate list (most recent 5, for chat display)
 */
router.post('/get-nameplates', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_avatar } = req.body;
  const DISPLAY_LIMIT = 5;

  const user = await UserService.getUserByTwitchId(
    twitch_id,
    twitch_display_name,
    twitch_avatar
  );

  const totalCount = user.nameplates.length;

  if (totalCount === 0) {
    return ResponseHandler.success(res, { nameplates: [], total: 0 },
      "You're not registered in the Frequent Flyer Program yet."
    );
  }

  const recentNameplates = await NameplateService.getRecentUserNameplates(user.id, DISPLAY_LIMIT);
  const nameplateList = recentNameplates.map(nameplate => nameplate.sysname);

  if (totalCount === 1) {
    return ResponseHandler.success(res, { nameplates: recentNameplates, total: totalCount },
      `You have the [${nameplateList[0]}] Nameplate. Collect more via Mystery Nameplate Pull!`
    );
  }

  const summary = totalCount > DISPLAY_LIMIT
    ? `Your ${DISPLAY_LIMIT} most recent nameplates (of ${totalCount} total): [${nameplateList.join(', ')}]. ` +
      `Manage your full collection at mainframe.the13thgeek.com!`
    : `You have (${totalCount}) nameplates: [${nameplateList.join(', ')}].`;

  return ResponseHandler.success(res, { nameplates: recentNameplates, total: totalCount },
    `${summary} Use !setnp <keyword> to change your active nameplate!`
  );
}));

/**
 * POST /mainframe/get-available-nameplates
 * Get available nameplates for pulling
 */
router.post('/get-available-nameplates', asyncHandler(async (req, res) => {
  const nameplates = await NameplateService.getAvailableNameplates();
  return ResponseHandler.success(res, { nameplates }, 'Available nameplates retrieved');
}));

/**
 * POST /mainframe/catalog
 * Get nameplate catalog
 */
router.post('/catalog', asyncHandler(async (req, res) => {
  const catalog = await NameplateService.getCatalog();
  return ResponseHandler.success(res, { catalog }, 'Catalog retrieved');
}));

/**
 * POST /mainframe/user-profile
 * Get user profile by ID
 */
router.post('/user-profile', asyncHandler(async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return ResponseHandler.validationError(res, { user_id: 'Required' });
  }

  const user = await UserService.getUserById(user_id);

  if (!user) {
    return ResponseHandler.notFound(res, 'User');
  }

  return ResponseHandler.success(res, user, 'Profile retrieved');
}));

/**
 * POST /mainframe/send-action
 * Generic action handler (EXP, stats, achievements)
 */
router.post('/send-action', asyncHandler(async (req, res) => {
  const { 
    twitch_id, twitch_display_name, twitch_roles, twitch_avatar,
    exp, stat_name, value, increment 
  } = req.body;

  const isPremium = UserService.isPremium(twitch_roles);
  const user = await UserService.getUserByTwitchId(
    twitch_id,
    twitch_display_name,
    twitch_avatar
  );

  // Award EXP if provided
  if (exp) {
    await UserService.awardExp(user.id, isPremium, exp);
  }

  // Update stats and check achievements
  const achievements = [];
  
  if (stat_name && stat_name.length > 0) {
    for (let i = 0; i < stat_name.length; i++) {
      // Handle sub_months separately
      if (stat_name[i] === 'sub_months') {
        await UserService.setSubMonths(user.id, value[i]);
      } else {
        await UserService.updateStat(user.id, stat_name[i], value[i], increment[i]);
        const ach = await UserService.checkAchievements(user.id, stat_name[i]);
        if (ach) achievements.push(ach);
      }
    }
  }

  const message = achievements.length > 0
    ? `Congrats! You earned: ${achievements.join(', ')}`
    : 'Action completed';

  return ResponseHandler.success(res, {
    has_achievement: achievements.length > 0,
    achievements: achievements.join(', ')
  }, message);
}));

/**
 * POST /mainframe/ranking
 * Get leaderboard rankings
 */
router.post('/ranking', asyncHandler(async (req, res) => {
  const { rank_type, items_to_show = 5 } = req.body;

  const validTypes = ['exp', 'spender', 'redeems', 'checkins_last', 'checkins', 'achievements'];
  
  if (!validTypes.includes(rank_type)) {
    return ResponseHandler.validationError(res, {
      rank_type: `Must be one of: ${validTypes.join(', ')}`
    });
  }

  const rankings = await RankingService.getRanking(rank_type, items_to_show);

  return ResponseHandler.success(res, rankings, 'Rankings retrieved');
}));

/**
 * POST /mainframe/flight-report
 * Get user flight report
 */
router.post('/flight-report', asyncHandler(async (req, res) => {
  const { user_name } = req.body;

  if (!user_name) {
    return ResponseHandler.validationError(res, { user_name: 'Required' });
  }

  const report = await UserService.getFlightReport(user_name);

  if (!report) {
    return ResponseHandler.notFound(res, 'User flight report');
  }

  return ResponseHandler.success(res, report, 'Flight report retrieved');
}));

module.exports = router;