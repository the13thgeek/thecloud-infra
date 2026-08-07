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
  await TourneyService.initDiamondHeist();
  Logger.info('Tournament initialized/reset');
  return ResponseHandler.success(res, {}, 'Tournament initialized');
}));

// POST /tourney/drop - signal start of round or perform drop
router.post('/drop', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar, source } = req.body;
  const result = await TourneyService.dropDiamond(null, "drop");
  Logger.info(result.message);
  return ResponseHandler.success(res, result, result.message);
}));

// POST /tourney/grab
router.post('/grab', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar } = req.body;
  const message = TourneyService.getRandomMessage('POST_EVENT_MESSAGES', twitch_display_name, '!grab');
  return ResponseHandler.error(res, message, 403);
 
  // TourneyService.enqueue('grab', async () => {
  //   try {
  //     // Check if game is active
  //     if( !TourneyService.isActive ) {
  //       const message = TourneyService.getRandomMessage('PREMATURE_GRAB_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403);
  //     }

  //     // Check if the diamond is still available
  //     Logger.info(`Current diamond holder: ${JSON.stringify(TourneyService.getDiamondHolder())}`);
  //     if( TourneyService.getDiamondHolder() !== null ) {
  //       const message = TourneyService.getRandomMessage('GRAB_UNAVAILABLE_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403);
  //     }

  //     // Check if user just dropped the diamond
  //     if (TourneyService.lastHolder?.twitchId === twitch_id) {
  //       const message = TourneyService.getRandomMessage('DROP_GRAB_ATTEMPT_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403);    
  //     }

  //     // Check if the user is already holding the diamond (edge case for multiple rapid requests)
  //     if (TourneyService.getDiamondHolder()?.twitchId === twitch_id) {
  //       const message = TourneyService.getRandomMessage('ALREADY_HOLDING_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403);    
  //     }

  //     // Check if user is registered for the event
  //     const user = await UserService.getUserByTwitchId(twitch_id, twitch_display_name, twitch_avatar, UserService.isPremium(twitch_roles));
  //     if (!user) {
  //         return ResponseHandler.error(res, `Sorry @${twitch_display_name}, you must be registered for the event to grab the Black Diamond. Please type !tourney to join a faction and start earning points!`, 403);
  //     }

  //     // Check if user is on a faction
  //     const userFaction = await TourneyService.getUserFaction(twitch_display_name);
  //     Logger.info(JSON.stringify(userFaction));
  //     if (!userFaction.success) {
  //       return ResponseHandler.error(res, `@${twitch_display_name}, you need to be on a faction to grab the Black Diamond! Join a faction by typing !tourney in chat.`, 403);
  //     }
      
  //     // Reset passer data
  //     TourneyService.lastPasser = null;

  //     // All checks passed, attempt to grab the diamond
  //     TourneyService.diamondHolder = {
  //       twitchId: twitch_id,
  //       displayName: twitch_display_name,
  //       avatar: twitch_avatar,
  //       faction: userFaction.team_name,
  //       factionId: userFaction.team_number,
  //       userId: user.id
  //     }

  //     // Award points
  //     TourneyService.awardPoints(twitch_display_name, 1, 'Diamond Grab', 'HEIST_GRAB');

  //     const message = TourneyService.getRandomMessage('GRAB_MESSAGES', twitch_display_name, userFaction.team_name);
  //     return ResponseHandler.success(res, {
  //       twitchId: twitch_id,
  //       displayName: twitch_display_name,
  //       avatar: twitch_avatar,
  //       faction: userFaction.team_number
  //     }, message);

  //   } catch(err) {
  //     Logger.error('System error: ', { error: err.message });
  //     return ResponseHandler.error(res, err.message, 500);
  //   }
  // });
  

}));

// POST /tourney/steal
router.post('/steal', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar, target_user } = req.body;
  //const attemptMessage = TourneyService.getRandomMessage('STEAL_ATTEMPT_MESSAGES', twitch_display_name, target_user);
  const targetUser = cleanUsername(target_user);
  const currentHolder = TourneyService.getDiamondHolder();

  const message = TourneyService.getRandomMessage('POST_EVENT_MESSAGES', twitch_display_name, '!steal');
  return ResponseHandler.error(res, message, 403);
  
  // Logger.debug(`currentHolder: ${currentHolder?.displayName}, targetUser: ${targetUser}`);
  // Logger.info(`Steal attempt by @${twitch_display_name} targeting @${targetUser}`);

  // TourneyService.enqueue('steal', async () => {
  //   try {
  //     // Check if target user is specified  
  //     if (!targetUser) {
  //       const message = TourneyService.getRandomMessage('STEAL_MISSING_TARGET_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403, { outcome: 'invalid' });
  //     }

  //     // Check if game is active and/or if the diamond is currently held by someone
  //     if( !TourneyService.isActive || !TourneyService.getDiamondHolder() ) {
  //       const message = TourneyService.getRandomMessage('PREMATURE_GRAB_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403, { outcome: 'invalid' });
  //     }

  //     // Check is user is trying to steal from self  
  //     if (twitch_display_name.toLowerCase() === targetUser && currentHolder.displayName.toLowerCase() === targetUser) {   
  //       const message = TourneyService.getRandomMessage('STEAL_SELF_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403, { outcome: 'invalid' });
  //     }

  //     // Check if user is on a faction
  //     const targetUserFaction = await TourneyService.getUserFaction(targetUser);
  //     Logger.info(JSON.stringify(targetUserFaction));
  //     if (!targetUserFaction.success) {
  //       return ResponseHandler.error(res, `@${targetUser} is not registered for the event.`, 403);
  //     }

  //     // Check if user is stealing from their own faction
  //     const userFaction = await TourneyService.getUserFaction(twitch_display_name);
      
  //     if (userFaction.team_number === targetUserFaction.team_number) {
  //       const message = TourneyService.getRandomMessage('STEAL_TEAMMATE_MESSAGES', twitch_display_name, targetUser);
  //       return ResponseHandler.error(res, message, 403, { outcome: 'invalid' });
  //     }

  //     // Check if user is holding the diamond
  //     if (currentHolder.displayName.toLowerCase() !== targetUser) {
  //       // Award false accusation points to target
  //       Logger.info(`False Accusation: currentHolder: ${currentHolder.displayName} vs target: ${targetUser}`);
  //       TourneyService.awardPoints(targetUser, 1, 'False Accusation Bonus', 'HEIST_STEAL_FALSE');
        
  //       const message = TourneyService.getRandomMessage('STEAL_INVALID_MESSAGES', twitch_display_name, targetUser);
  //       return ResponseHandler.error(res, message, 403, { outcome: 'invalid' });
  //     }

  //     // Check stealer's Lupin
  //     const stealerItem = await TourneyService.getActiveItem(twitch_display_name);
  //     Logger.debug(`stealer: ${twitch_display_name} with ${stealerItem}`);
  //     let stealRates = TourneyService.stealRates;
  //     let usingLupin = false;

  //     if (stealerItem === 'lupin') {
  //       usingLupin = true;
  //       stealRates = { drop: 2, success: 85, fail: 13 };
  //       Logger.debug(`if (stealerItem === 'lupin')`);
  //       await TourneyService.clearActiveItem(twitch_display_name);
  //     }

  //     // Check holder's Smokescreen
  //     const holderItem = await TourneyService.getActiveItem(currentHolder.displayName);
  //     if (holderItem === 'smokescreen') {
  //       await TourneyService.clearActiveItem(currentHolder.displayName);
  //       const message = TourneyService.getRandomMessage('SMOKESCREEN_BLOCK_MESSAGES', twitch_display_name, targetUser);
  //       return ResponseHandler.error(res, message, 403, { outcome: 'blocked' });
  //     }
      
  //     // All checks passed, attempt steal, roll dice
  //     const { drop, success } = stealRates;
  //     const roll = Math.random() * 100;
  //     Logger.info(`Steal attempt by @${twitch_display_name} on @${targetUser}. Roll: ${roll.toFixed(2)} (Drop: ${drop}%, Success: ${success}%)`);

  //     if (roll <= drop) {
  //       // 5% fumble - current holder drops the diamond
  //       const result = await TourneyService.dropDiamond(twitch_display_name, 'fumble');
  //       return ResponseHandler.error(res, result.message, 403, { outcome: 'fumble', intercepted: result.intercepted })
  //     } else if (roll <= drop + success) {
  //       // 50% success - steal successful
  //       TourneyService.diamondHolder = {
  //         twitchId: twitch_id,
  //         displayName: twitch_display_name,
  //         avatar: twitch_avatar,
  //         faction: userFaction.team_name,
  //         factionId: userFaction.team_number
  //       };   

  //       // Award points
  //       TourneyService.awardPoints(twitch_display_name, 1, 'Diamond Steal', 'HEIST_STEAL_SUCCESS');
  //       // Reset passer data
  //       TourneyService.lastPasser = null;

  //       const messageKey = usingLupin ? 'LUPIN_SUCCESS_MESSAGES' : 'STEAL_SUCCESS_MESSAGES';
  //       const message = TourneyService.getRandomMessage(messageKey, twitch_display_name, targetUser);
  //       return ResponseHandler.success(res, { outcome: 'success', message, faction: userFaction.team_number }, message);
  //     } else {
  //       // 45% failure - steal fails
  //       const message = TourneyService.getRandomMessage('STEAL_FAIL_MESSAGES', twitch_display_name, targetUser);
  //       //return ResponseHandler.success(res, { outcome: 'fail', message }, message);
  //       return ResponseHandler.error(res, message, 403, { outcome: 'fail' });
  //     }

  //   } catch(err) {
  //     Logger.error('System error: ', { error: err.message });
  //     return ResponseHandler.error(res, err.message, 500);
  //   }
  // });

}));

// POST /tourney/pass
router.post('/pass', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar, target_user } = req.body;
  const targetUser = cleanUsername(target_user);

  const message = TourneyService.getRandomMessage('POST_EVENT_MESSAGES', twitch_display_name, '!pass');
  return ResponseHandler.error(res, message, 403);

  // TourneyService.enqueue('pass', async () => {
  //   try {
  //     // Check if game is active and/or if the diamond is currently held by someone
  //     if( !TourneyService.isActive || !TourneyService.getDiamondHolder() ) {
  //       const message = TourneyService.getRandomMessage('PREMATURE_GRAB_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403);
  //     }

  //     // Check if user actually has the diamond
  //     const currentHolder = TourneyService.getDiamondHolder();
  //     if (currentHolder.twitchId !== twitch_id) {
  //       const message = TourneyService.getRandomMessage('PASS_NOT_HOLDER_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403);
  //     }
    
  //     // Check if target user exists
  //     const targetUserFaction = await TourneyService.getUserFaction(targetUser);
  //     Logger.info(JSON.stringify(targetUserFaction));
  //     if (!targetUserFaction.success) {
  //       const message = TourneyService.getRandomMessage('PASS_INVALID_TARGET_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403);
  //     }

  //     // Check if user is passing to theirself
  //     if (TourneyService.getDiamondHolder().displayName === targetUser) {
  //       const message = TourneyService.getRandomMessage('PASS_SELF_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403);
  //     }

  //     // Check if user is passing to someone on the other team
  //     const userFaction = await TourneyService.getUserFaction(twitch_display_name);
  //     if (userFaction.team_number !== targetUserFaction.team_number) {
  //       // Enemy pass — recipient gets +2, passer gets nothing
  //       const newHolder = await UserService.getUserByDisplayName(targetUser);
  //       TourneyService.lastPasser = twitch_display_name;
  //       TourneyService.diamondHolder = {
  //         twitchId: newHolder.twitch_id,
  //         displayName: newHolder.twitch_display_name,
  //         avatar: newHolder.twitch_avatar,
  //         faction: targetUserFaction.team_name,
  //         factionId: targetUserFaction.team_number,
  //         userId: newHolder.id
  //       };

  //       TourneyService.awardPoints(targetUser, 2, 'Enemy Pass Bonus', 'HEIST_PASS');

  //       const message = TourneyService.getRandomMessage('PASS_ENEMY_FACTION_MESSAGES', twitch_display_name, targetUser, targetUserFaction.team_name);
  //       return ResponseHandler.success(res, { faction: targetUserFaction.team_number, outcome: 'enemy_pass' }, message);
  //     }

  //     // Old rule - keeping old block code
  //     // if (userFaction.team_number !== targetUserFaction.team_number) {
  //     //   const message = TourneyService.getRandomMessage('PASS_WRONG_FACTION_MESSAGES', twitch_display_name, targetUser);
  //     //   return ResponseHandler.error(res, message, 403);
  //     // }

  //     // Check if the user isn't passing it back to the person who passed it to them
  //     if( TourneyService.lastPasser === targetUser ) {
  //       const message = TourneyService.getRandomMessage('PASS_BACK_MESSAGES', twitch_display_name, targetUser);
  //       return ResponseHandler.error(res, message, 403);
  //     }

  //     // All checks passed, perform pass
  //     // Get new user data
  //     const newHolder = await UserService.getUserByDisplayName(targetUser);

  //     // Record who passed it
  //     TourneyService.lastPasser = twitch_display_name;

  //     TourneyService.diamondHolder = {
  //       twitchId: newHolder.twitch_id,
  //       displayName: newHolder.twitch_display_name,
  //       avatar: newHolder.twitch_avatar,
  //       faction: targetUserFaction.team_name,
  //       factionId: targetUserFaction.team_number,
  //       userId: newHolder.id
  //     }
      
  //     // Award points
  //     TourneyService.awardPoints(twitch_display_name, 1, 'Diamond Pass', 'HEIST_PASS');

  //     const message = TourneyService.getRandomMessage('PASS_SUCCESS_MESSAGES', twitch_display_name, targetUser, userFaction.team_name);
  //     return ResponseHandler.success(res, { faction: targetUserFaction.team_number }, message);

  //   } catch(err) {
  //     Logger.error('System error: ', { error: err.message });
  //     return ResponseHandler.error(res, err.message, 500);
  //   }
  // });

}));

// POST /tourney/scores
router.post('/scores', asyncHandler(async (req, res) => {
  const scoreList = await TourneyService.getScoreboard();
  return ResponseHandler.success(res, scoreList, 'Current Scores');
}));

// POST /tourney/members
router.post('/members', asyncHandler(async (req, res) => {
  const memberList = await TourneyService.getMembersScore();
  return ResponseHandler.success(res, memberList, 'Current Scores');
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
    TourneyService.awardPoints(currentHolder.displayName, 10, 'End of Round Bonus', 'HEIST_END_ROUND');
  } else {
    Logger.info('Round ended with no diamond holder');
    return ResponseHandler.error(res, 'Round ended with no diamond holder.', 403);
  }

  // Reset for next round
  TourneyService.initDiamondHeist();

  const message = TourneyService.getRandomMessage('ROUND_END_MESSAGES', currentHolder.displayName, currentHolder.faction);
  return ResponseHandler.success(res, currentHolder, message);
}));

// POST /tourney/contraband
router.post(`/contraband`, asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar } = req.body;
  
  const user = await UserService.getUserByTwitchId(twitch_id, twitch_display_name, twitch_avatar);

  // Check if user is registered
  const userFaction = await TourneyService.getUserFaction(twitch_display_name);

  if (!userFaction.success) {
    const message = TourneyService.getRandomMessage(`NOT_REGISTERED_MESSAGES.${userFaction.reason}`, twitch_display_name);
    return ResponseHandler.error(res, message, 403);
  }
  
  const item = TourneyService.rollContrabandItem();
  await TourneyService.assignActiveItem(user.id, item);

  const messageKey = item.replace(/[01]$/, '');
  const publicMessage = TourneyService.getRandomMessage('CONTRABAND_REDEEM_MESSAGES', twitch_display_name);
  const whisperMessage = TourneyService.getContrabandWhisper(messageKey, twitch_display_name);

  return ResponseHandler.success(res, {whisper: whisperMessage}, publicMessage);
}));

// POST /tourney/use
router.post('/use', asyncHandler(async (req, res) => {
  const { twitch_id, twitch_display_name, twitch_roles, twitch_avatar } = req.body;

  const message = TourneyService.getRandomMessage('POST_EVENT_MESSAGES', twitch_display_name, '!use');
  return ResponseHandler.error(res, message, 403);

  // const user = await UserService.getUserByTwitchId(twitch_id, twitch_display_name, twitch_avatar);
  // const activeItem = await TourneyService.getActiveItem(twitch_display_name);

  // if (!activeItem) {
  //   const message = TourneyService.getRandomMessage('NO_ACTIVE_ITEM_MESSAGES', twitch_display_name);
  //   return ResponseHandler.error(res, message, 403);
  // }

  // switch (activeItem) {
  //   case 'insurance0': {
  //     await TourneyService.assignActiveItem(user.id, 'insurance1');
  //     const userFaction = await TourneyService.getUserFaction(twitch_display_name);
  //     const message = TourneyService.getRandomMessage('ITEM_ARM_MESSAGES', twitch_display_name, userFaction.team_name);
  //     return ResponseHandler.success(res, { item: 'insurance', message }, message);
  //   }

  //   case 'insurance1': {
  //     const message = TourneyService.getRandomMessage('ALREADY_ACTIVE_MESSAGES', twitch_display_name);
  //     return ResponseHandler.error(res, message, 403);
  //   }

  //   case 'lupin': {
  //     const message = TourneyService.getRandomMessage('ALREADY_ACTIVE_MESSAGES', twitch_display_name);
  //     return ResponseHandler.error(res, message, 403);
  //   }

  //   case 'smokescreen': {
  //     const message = TourneyService.getRandomMessage('ALREADY_ACTIVE_MESSAGES', twitch_display_name);
  //     return ResponseHandler.error(res, message, 403);
  //   }

  //   case 'flashpoint': {
  //     if( !TourneyService.getDiamondHolder() ) {
  //       await TourneyService.clearActiveItem(twitch_display_name);
  //       const message = TourneyService.getRandomMessage('FLASHPOINT_NO_HOLDER_MESSAGES', twitch_display_name);
  //       return ResponseHandler.error(res, message, 403);
  //     }

  //     const holder = TourneyService.getDiamondHolder();
  //     const userFaction = await TourneyService.getUserFaction(twitch_display_name);
  //     const isOwnFaction = userFaction.team_number === holder.factionId;

  //     const result = await TourneyService.dropDiamond(twitch_display_name, 'flashpoint');
  //     await TourneyService.clearActiveItem(twitch_display_name);

  //     Logger.info(`Flashpoint used by @${twitch_display_name}. Diamond dropped.`);
  //     Logger.info(JSON.stringify(result));

  //     const message = isOwnFaction
  //       ? TourneyService.getRandomMessage('FLASHPOINT_OWN_FACTION_MESSAGES', twitch_display_name, holder.displayName)
  //       : result.message;

  //     return ResponseHandler.success(res, { item: 'flashpoint', message, intercepted: result.intercepted }, message);
  //   }

  //   case 'firewall0': {
  //     await TourneyService.assignActiveItem(user.id, 'firewall1');
  //     const userFaction = await TourneyService.getUserFaction(twitch_display_name);
  //     const message = TourneyService.getRandomMessage('ITEM_ARM_MESSAGES', twitch_display_name, userFaction.team_name);
  //     return ResponseHandler.success(res, { item: 'firewall', message }, message);
  //   }

  //   case 'firewall1': {
  //     const message = TourneyService.getRandomMessage('ALREADY_ACTIVE_MESSAGES', twitch_display_name);
  //     return ResponseHandler.error(res, message, 403);
  //   }

  //   case 'intel': {
  //     // consume item
  //     await TourneyService.clearActiveItem(twitch_display_name);

  //     // If nobody is holding the diamond, return corrupt intel message
  //     const currentHolder = TourneyService.getDiamondHolder();
  //     if (!currentHolder) {
  //       const message = TourneyService.getRandomMessage('INTEL_CORRUPTED_MESSAGES');
  //       return ResponseHandler.success(res, { item: 'intel', message }, message);
  //     }

  //     // Get holder faction
  //     const holderFaction = await TourneyService.getUserFaction(currentHolder.displayName);
  //     // Check if holder's faction has a firewall active
  //     const firewallHolder = await TourneyService.getFactionActiveItemHolder(holderFaction.team_number, 'firewall1');

  //     if(firewallHolder) {
  //       // Consume firewall item
  //       await TourneyService.clearActiveItem(firewallHolder.twitch_display_name);

  //       // Lie; roll 70/30 for corrupted intel type
  //       const roll = Math.random() * 100;

  //       if( roll <= 70 ) {
  //         // 70% lie
  //         const userFaction = await TourneyService.getUserFaction(twitch_display_name);
  //         const allFactions = [1, 2, 3];
  //         const excludedFactions = [...new Set([holderFaction.team_number, userFaction.team_number])];
  //         const remainingFactions = allFactions.filter(f => !excludedFactions.includes(f));
          
  //         // If same faction (requester holds diamond), RNG between the two remaining
  //         const lyingFactionId = remainingFactions[Math.floor(Math.random() * remainingFactions.length)];
  //         const lyingFactionName = TourneyService.TEAM_NAMES[lyingFactionId];

  //         const message = TourneyService.getRandomMessage('INTEL_REPORT_MESSAGES', lyingFactionName);
  //         return ResponseHandler.success(res, { item: 'intel', message }, message);
  //       } else {
  //         // 30% garbled intel
  //         const message = TourneyService.getRandomMessage('INTEL_CORRUPTED_MESSAGES');
  //         return ResponseHandler.success(res, { item: 'intel', message }, message);
  //       }
  //     }

  //     // If no firewall, return true intel
  //     const message = TourneyService.getRandomMessage('INTEL_REPORT_MESSAGES', holderFaction.team_name);
  //     return ResponseHandler.success(res, { item: 'intel', message }, message);
  //   }

  //   default: {
  //     const message = TourneyService.getRandomMessage('NO_ACTIVE_ITEM_MESSAGES', twitch_display_name);
  //     return ResponseHandler.error(res, message, 403);
  //   }   

  // }
}));

// POST /tourney/tick
router.post('/tick', asyncHandler(async (req, res) => {
  const holder = TourneyService.getDiamondHolder();

  if(!holder) {
    return ResponseHandler.error(res, 'No current diamond holder.', 403);
  }

  TourneyService.awardPoints(holder.displayName, 1, 'Diamond Hold Tick', 'HEIST_HOLD_TICK');
  return ResponseHandler.success(res, { displayName: holder.displayName, faction: holder.faction }, 'Hold tick');

}));

module.exports = router;