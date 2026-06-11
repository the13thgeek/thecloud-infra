const express = require('express');
const router = express.Router();
const { ResponseHandler, asyncHandler } = require('../utils/ResponseHandler');
const UserService = require('../services/UserService');
const TourneyService = require('../services/TourneyService');
const Logger = require('../utils/Logger');

// Basic helpers
// Remove @ from username if present and trim whitespace
const cleanUsername = (username) => username?.replace(/^@/, '').trim().toLowerCase();

// POST /tourney/register
router.post('/register', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar } = req.body;
  const user = await UserService.getUserByTwitchId(twitch_id, twitch_display_name, twitch_avatar, UserService.isPremium(twitch_roles));
  const regData = await TourneyService.registerUser(user.id, twitch_display_name);

  return ResponseHandler.success(res, {
    team_number: regData.team_number,
    team_name: regData.team_name,
    message: regData.message
  }, 'Registration successful');
}));

// POST /tourney/init
router.post('/init', asyncHandler(async (req, res) => {
  TourneyService.initDiamondHeist();
  Logger.info('Tournament initialized/reset');
  return ResponseHandler.success(res, {}, 'Tournament initialized');
}));

// POST /tourney/drop - signal start of round or perform drop
router.post('/drop', asyncHandler(async (req, res) => {
  const message = TourneyService.dropDiamond();
  Logger.info(message);
  return ResponseHandler.success(res, { message }, 'Diamond dropped');
}));

// POST /tourney/grab
router.post('/grab', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar } = req.body;
 
  try {
    // Check if game is active
    if( !TourneyService.isActive ) {
      const message = TourneyService.getRandomMessage('PREMATURE_GRAB_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);
    }

    // Check if the diamond is still available
    Logger.info(`Current diamond holder: ${JSON.stringify(TourneyService.getDiamondHolder())}`);
    if( TourneyService.getDiamondHolder() !== null ) {
      const message = TourneyService.getRandomMessage('GRAB_UNAVAILABLE_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);
    }

    // Check if user just dropped the diamond
    if (TourneyService.lastHolder?.twitchId === twitch_id) {
      const message = TourneyService.getRandomMessage('DROP_GRAB_ATTEMPT_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);    
    }

    // Check if the user is already holding the diamond (edge case for multiple rapid requests)
    if (TourneyService.getDiamondHolder()?.twitchId === twitch_id) {
      const message = TourneyService.getRandomMessage('ALREADY_HOLDING_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);    
    }

    // Check if user is registered for the event
    const user = await UserService.getUserByTwitchId(twitch_id, twitch_display_name, twitch_avatar, UserService.isPremium(twitch_roles));
    if (!user) {
        return ResponseHandler.error(res, `Sorry @${twitch_display_name}, you must be registered for the event to grab the Black Diamond. Please type !tourney to join a faction and start earning points!`, 403);
    }

    // Check if user is on a faction
    const userFaction = await TourneyService.getUserFaction(twitch_display_name);
    Logger.info(JSON.stringify(userFaction));
    if (!userFaction.success) {
      return ResponseHandler.error(res, `@${twitch_display_name}, you need to be on a faction to grab the Black Diamond! Join a faction by typing !tourney in chat.`, 403);
    }
    
    // Reset passer data
    TourneyService.lastPasser = null;

    // All checks passed, attempt to grab the diamond
    TourneyService.diamondHolder = {
      twitchId: twitch_id,
      displayName: twitch_display_name,
      avatar: twitch_avatar,
      faction: userFaction.team_name,
      factionId: userFaction.team_number
    }

    // Award points
    TourneyService.awardPoints(twitch_display_name, 1, 'Diamond Grab', 'HEIST_GRAB');

    const message = TourneyService.getRandomMessage('GRAB_MESSAGES', twitch_display_name, userFaction.team_name);
    return ResponseHandler.success(res, {
      twitchId: twitch_id,
      displayName: twitch_display_name,
      avatar: twitch_avatar,
      faction: userFaction.team_number
    }, message);

  } catch(err) {
    Logger.error('System error: ', { error: err.message });
    return ResponseHandler.error(res, err.message, 500);
  }

}));

// POST /tourney/steal
router.post('/steal', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar, target_user } = req.body;
  //const attemptMessage = TourneyService.getRandomMessage('STEAL_ATTEMPT_MESSAGES', twitch_display_name, target_user);
  const targetUser = cleanUsername(target_user);
  const currentHolder = TourneyService.getDiamondHolder();
  
  Logger.debug(`currentHolder: ${currentHolder?.displayName}, targetUser: ${targetUser}`);
  Logger.info(`Steal attempt by @${twitch_display_name} targeting @${targetUser}`);

  try {
    // Check if target user is specified  
    if (!targetUser) {
      const message = TourneyService.getRandomMessage('STEAL_MISSING_TARGET_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);
    }

    // Check if game is active and/or if the diamond is currently held by someone
    if( !TourneyService.isActive || !TourneyService.getDiamondHolder() ) {
      const message = TourneyService.getRandomMessage('PREMATURE_GRAB_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);
    }

    // Check is user is trying to steal from self  
    if (twitch_display_name.toLowerCase() === targetUser && currentHolder.displayName.toLowerCase() === targetUser) {   
      const message = TourneyService.getRandomMessage('STEAL_SELF_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);
    }

    // Check if user is on a faction
    const targetUserFaction = await TourneyService.getUserFaction(targetUser);
    Logger.info(JSON.stringify(targetUserFaction));
    if (!targetUserFaction.success) {
      return ResponseHandler.error(res, `@${targetUser} is not registered for the event.`, 403);
    }

    // Check if user is stealing from their own faction
    const userFaction = await TourneyService.getUserFaction(twitch_display_name);
    
    if (userFaction.team_number === targetUserFaction.team_number) {
      const message = TourneyService.getRandomMessage('STEAL_TEAMMATE_MESSAGES', twitch_display_name, targetUser);
      return ResponseHandler.error(res, message, 403);
    }

    // Check if user is holding the diamond
    if (currentHolder.displayName.toLowerCase() !== targetUser) {
      // Award false accusation points to target
      Logger.info(`False Accusation: currentHolder: ${currentHolder.displayName} vs target: ${targetUser}`);
      TourneyService.awardPoints(targetUser, 1, 'False Accusation Bonus', 'HEIST_STEAL_FALSE');
      
      const message = TourneyService.getRandomMessage('STEAL_INVALID_MESSAGES', twitch_display_name, targetUser);
      return ResponseHandler.error(res, message, 403);
    }

    // All checks passed, attempt steal, roll dice
    const { drop, success } = TourneyService.stealRates;
    const roll = Math.random() * 100;
    Logger.info(`Steal attempt by @${twitch_display_name} on @${targetUser}. Roll: ${roll.toFixed(2)} (Drop: ${drop}%, Success: ${success}%)`);

    if (roll <= drop) {
      // 5% fumble - current holder drops the diamond
      let message = TourneyService.dropDiamond(twitch_display_name);
      //return ResponseHandler.success(res, { outcome: 'drop', message }, message);
      return ResponseHandler.error(res, message, 403);
    } else if (roll <= drop + success) {
      // 50% success - steal successful
      TourneyService.diamondHolder = {
        twitchId: twitch_id,
        displayName: twitch_display_name,
        avatar: twitch_avatar,
        faction: userFaction.team_name,
        factionId: userFaction.team_number
      };   

      // Award points
      TourneyService.awardPoints(twitch_display_name, 1, 'Diamond Steal', 'HEIST_STEAL_SUCCESS');
      // Reset passer data
      TourneyService.lastPasser = null;

      const message = TourneyService.getRandomMessage('STEAL_SUCCESS_MESSAGES', twitch_display_name, targetUser);
      return ResponseHandler.success(res, { outcome: 'success', message, faction: userFaction.team_number }, message);
    } else {
      // 45% failure - steal fails
      const message = TourneyService.getRandomMessage('STEAL_FAIL_MESSAGES', twitch_display_name, targetUser);
      //return ResponseHandler.success(res, { outcome: 'fail', message }, message);
      return ResponseHandler.error(res, message, 403);
    }

  } catch(err) {
    Logger.error('System error: ', { error: err.message });
    return ResponseHandler.error(res, err.message, 500);
  }

}));

// POST /tourney/pass
router.post('/pass', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar, target_user } = req.body;
  const targetUser = cleanUsername(target_user);

  try {
    // Check if game is active and/or if the diamond is currently held by someone
    if( !TourneyService.isActive || !TourneyService.getDiamondHolder() ) {
      const message = TourneyService.getRandomMessage('PREMATURE_GRAB_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);
    }

    // Check if user actually has the diamond
    const currentHolder = TourneyService.getDiamondHolder();
    if (currentHolder.twitchId !== twitch_id) {
      const message = TourneyService.getRandomMessage('PASS_NOT_HOLDER_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);
    }
  
    // Check if target user exists
    const targetUserFaction = await TourneyService.getUserFaction(targetUser);
    Logger.info(JSON.stringify(targetUserFaction));
    if (!targetUserFaction.success) {
      const message = TourneyService.getRandomMessage('PASS_INVALID_TARGET_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);
    }

    // Check if user is passing to theirself
    if (TourneyService.getDiamondHolder().displayName === targetUser) {
      const message = TourneyService.getRandomMessage('PASS_SELF_MESSAGES', twitch_display_name);
      return ResponseHandler.error(res, message, 403);
    }

    // Check if user is passing to someone on the other team
    const userFaction = await TourneyService.getUserFaction(twitch_display_name);
    if (userFaction.team_number !== targetUserFaction.team_number) {
      const message = TourneyService.getRandomMessage('PASS_WRONG_FACTION_MESSAGES', twitch_display_name, targetUser);
      return ResponseHandler.error(res, message, 403);
    }

    // Check if the user isn't passing it back to the person who passed it to them
    if( TourneyService.lastPasser === targetUser ) {
      const message = TourneyService.getRandomMessage('PASS_BACK_MESSAGES', twitch_display_name, targetUser);
      return ResponseHandler.error(res, message, 403);
    }

    // All checks passed, perform pass
    // Get new user data
    const newHolder = await UserService.getUserByDisplayName(targetUser);

    // Record who passed it
    TourneyService.lastPasser = twitch_display_name;

    TourneyService.diamondHolder = {
      twitchId: newHolder.twitch_id,
      displayName: newHolder.twitch_display_name,
      avatar: newHolder.twitch_avatar,
      faction: targetUserFaction.team_name,
      factionId: targetUserFaction.team_number
    }
    
    // Award points
    TourneyService.awardPoints(twitch_display_name, 1, 'Diamond Pass', 'HEIST_PASS');

    const message = TourneyService.getRandomMessage('PASS_SUCCESS_MESSAGES', twitch_display_name, targetUser, userFaction.team_name);
    return ResponseHandler.success(res, { faction: targetUserFaction.team_number }, message);

  } catch(err) {
    Logger.error('System error: ', { error: err.message });
    return ResponseHandler.error(res, err.message, 500);
  }

}));

// POST /tourney/scores
router.post('/scores', asyncHandler(async (req, res) => {
  const scoreList = await TourneyService.getScoreboard();
  return ResponseHandler.success(res, scoreList, 'Current Scores');
}));

// POST /tourney/status
router.post('/status', asyncHandler(async (req, res) => {
  const data = {
    diamondHolder: TourneyService.getDiamondHolder(),
    lastHolder: TourneyService.lastHolder,
    lastPasser: TourneyService.lastPasser
  }
  return ResponseHandler.success(res, data, 'Current Status');
}));

// POST /tourney/end-round
router.post('/end-round', asyncHandler(async (req, res) => {
  // retrieve current holder before resetting for message
  const currentHolder = TourneyService.getDiamondHolder();

  if (currentHolder) {
    // Award points to current holder for end of round
    TourneyService.awardPoints(currentHolder.displayName, 5, 'End of Round Bonus', 'HEIST_END_ROUND');
  } else {
    Logger.info('Round ended with no diamond holder');
    return ResponseHandler.error(res, 'Round ended with no diamond holder.', 403);
  }

  // Reset for next round
  TourneyService.initDiamondHeist();

  const message = TourneyService.getRandomMessage('ROUND_END_MESSAGES', currentHolder.displayName, currentHolder.faction);
  return ResponseHandler.success(res, currentHolder, message);
}));

module.exports = router;