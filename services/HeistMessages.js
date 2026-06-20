module.exports = {
  PREMATURE_GRAB_MESSAGES : [
    (username) => `Easy, @${username}. Nothing's hit the floor yet. Patience.`,
    (username) => `Hold on, @${username}. The Black Diamond is still secured!`,
    (username) => `Not so fast, @${username}. The Black Diamond hasn't been dropped!`,
    (username) => `Easy there, @${username}! The Black Diamond is still in its display case. We're bandits, not prophets!`,
    (username) => `Hold, @${username}! The Black Diamond hasn't even hit the floor yet. This isn't one of those speedrun categories!`,
    (username) => `The Black Diamond is still secured, @${username}. Even I'm not spawning loot that fast!`,
    (username) => `@${username}, I admire the enthusiasm, but we're not looting air molecules yet.`,
    (username) => `@${username}, you're trying to loot a future event. I respect the time travel attempt, but no.`,
    (username) => `Even I, your overly enthusiastic dungeon master, cannot authorize loot that hasn't spawned, @${username}.`
  ],

  INITIAL_DROP_MESSAGES : [
    () => `💎 The Black Diamond has been dropped! Who will claim it?`,
    () => `💎 The Black Diamond is loose! Grab it if you can!`,
    () => `💎 The Black Diamond has hit the floor! Who will be the first to claim it?`
  ],

  REGISTER_MESSAGES : [
    (username, factionName) => `@${username} has joined the crew. Welcome to ${factionName}.`,
    (username, factionName) => `${factionName} gains another body. Welcome aboard, @${username}.`,
    (username, factionName) => `@${username} is now running with ${factionName}. Don't slow them down.`,
    (username, factionName) => `The roster grows. @${username} reports to ${factionName}, effective now.`,
    (username, factionName) => `${factionName} has a new face. Make it count, @${username}.`,
    (username, factionName) => `@${username} passed the vetting. ${factionName} opens the door — once.`,
    (username, factionName) => `${factionName} has been watching @${username} for a while. Today they make it official.`,
    (username, factionName) => `@${username} is in. ${factionName} doesn't recruit lightly. Don't make them regret it.`,
    (username, factionName) => `The call went out. @${username} answered. ${factionName} welcomes their newest operative.`,
    (username, factionName) => `@${username} signed on with ${factionName}. No going back now.`
  ],

  DROP_MESSAGES : [
    (username) => `⚠️ The Black Diamond slips from @${username}'s grasp and clatters to the ground!`,
    (username) => `⚠️ Oh no! @${username} fumbled the Black Diamond and it fell to the floor!`,
    (username) => `⚠️ The Black Diamond has been dropped by @${username}! It hits the ground with a thud!`,
    (username) => `⚠️ Yikes! @${username} lost hold of the Black Diamond and it crashes down!`
  ],

  GRAB_MESSAGES : [
    (username, factionName) => `💎 @${username} moves fast through the gallery and snatches the Black Diamond off the floor! ${factionName} is now on the grid. The clock starts!`,
    (username, factionName) => `💎 The Black Diamond doesn't stay on the floor for long. @${username} gets there first. ${factionName} has 30 minutes before the trace locks in!`,
    (username, factionName) => `💎 @${username} cuts through the chaos and picks up the Black Diamond. ${factionName} is holding. The biometric clock is running!`,
    (username, factionName) => `💎 @${username} of ${factionName} reaches the diamond first. Off the floor and into their hands! The security system takes notice.`,
    (username, factionName) => `💎 The scramble ends. @${username} has the Black Diamond. ${factionName} just painted a target on themselves. 30 minutes on the clock!`,
    (username, factionName) => `💎 The moment @${username} touches the Black Diamond, the entire facility reacts. ${factionName} is now flagged.`,
    (username, factionName) => `💎 @${username} secures the Black Diamond. The floor is empty again — but the system is no longer idle.`,
    (username, factionName) => `💎 It's gone. @${username} has it. ${factionName} just triggered something that absolutely should not be triggered.`,
    (username, factionName) => `💎 @${username} lifts the Black Diamond from the ground. The gallery lights subtly shift. ${factionName} is now tracked.`,
    (username, factionName) => `💎 The Black Diamond is now in motion again — carried by @${username}. ${factionName} enters active status.`,
    (username, factionName) => `💎 @${username} grabs the Black Diamond cleanly. Somewhere in the system, a timer that was waiting *finally starts blinking red*.`,
    (username, factionName) => `💎 No hesitation. @${username} takes the Black Diamond. ${factionName} is now part of the incident report.`,
    (username, factionName) => `💎 The floor is clear. The Black Diamond is not. @${username} has it — and ${factionName} is now visible to security.`,
    (username, factionName) => `💎 @${username} secures the artifact. The heist stops being theoretical. ${factionName} is now in motion.`,
    (username, factionName) => `💎 The Black Diamond leaves the floor under @${username}'s control. The system logs it instantly: ${factionName} engaged.`,
    (username, factionName) => `💎 @${username} completes the pickup. The gallery doesn't respond loudly — it responds *quietly*. That's worse.`,
    (username, factionName) => `💎 The Black Diamond is claimed. @${username} stands up with it. ${factionName} has entered the danger window.`
  ],

  ALREADY_HOLDING_MESSAGES: [
    (username) => `@${username} tries to grab the Black Diamond. They are already holding the Black Diamond.`,
    (username) => `@${username} already has it. This is not a drill. They already have it.`,
    (username) => `The Black Diamond is in @${username}'s hands. @${username} is trying to grab the Black Diamond. We'll give them a moment.`,
    (username) => `@${username} reaches for the diamond they are currently holding. The crew needs a break.`,
    (username) => `@${username} already has the Black Diamond. What exactly is the plan here.`,
    (username) => `@${username} is attempting to grab the Black Diamond while actively holding the Black Diamond. I process thousands of messages a day and somehow this still surprises me.`,
    (username) => `@${username} reaches for the diamond currently in their hand. I know I'm just a bot, but I feel like I'm adding another grey hair.`,
    (username) => `@${username} already has the Black Diamond. We just talked about this. Scroll up.`,
  ],

  GRAB_UNAVAILABLE_MESSAGES : [
    (username) => `Sorry, @${username}, the Black Diamond has already been picked up!`,
    (username) => `Too late, @${username}. The Black Diamond is no longer on the floor!`,
    (username) => `@${username}, the Black Diamond has already been claimed. Better luck next time!`,
    (username) => `The Black Diamond is off the floor, @${username}. Someone else got to it first!`,
    (username) => `@${username} arrives to an empty display space. The Black Diamond is already gone.`,
    (username) => `The dust is still settling, @${username} — but the Black Diamond is no longer here.`,
    (username) => `@${username} checks the floor... checks again... yeah, it's gone.`,
    (username) => `You're a few seconds too late, @${username}. The Black Diamond has already entered circulation.`,
    (username) => `@${username} steps into the gallery just in time to miss everything important.`,
    (username) => `No sparkle. No trace. @${username} finds only the aftermath of a successful grab.`,
  ],

  DROP_GRAB_ATTEMPT_MESSAGES : [
    (username) => `@${username}, you just had it in your hands. Catch your breath — let someone else make a move first.`,
    (username) => `Easy, @${username}. You dropped it, now you wait. That's the code.`,
    (username) => `Not yet @${username}. You had your turn — give the others a shot at it first.`,
    (username) => `Hold on, @${username}. The Black Diamond is on the floor now. Let it settle before you go for it again.`,
    (username) => `@${username} persistence isn't the same as eligibility. Wait for the next drop before you try again!`
  ],

  STEAL_MISSING_TARGET_MESSAGES : [
    (username) => `@${username}, you need to specify a target to steal from!`,
    (username) => `Don't forget the target, @${username}! Who are you trying to steal from?`,
    (username) => `@${username}, you need to name a target for your steal attempt!`,
    (username) => `Steal who, @${username}? You need to specify a target!`,
    (username) => `@${username}, you forgot to include a target for your steal attempt!`
  ],
  
  STEAL_ATTEMPT_MESSAGES : [
    (username1, username2) => `@${username1} is making a move on @${username2}. The crew holds their breath...`,
    (username1, username2) => `@${username1} has eyes on @${username2}. Closing in slowly...`,
    (username1, username2) => `@${username1} spots an opening. @${username2} doesn't know it yet...`,
    (username1, username2) => `The play is in motion. @${username1} is going for @${username2}'s Black Diamond...`,
    (username1, username2) => `@${username1} makes their approach. All eyes on @${username2}...`
  ],

  STEAL_SUCCESS_MESSAGES : [
    (username1, username2) => `💎 @${username1} lifts the Black Diamond off @${username2} without a sound. The biometric trace shifts! @${username2} is clean. @${username1} is not.`,
    (username1, username2) => `💎 Clean lift! @${username2} didn't feel a thing. The security system is now tracking @${username1}.`,
    (username1, username2) => `💎 @${username1} makes the swap mid-gallery. @${username2} is off the grid. The clock resets — and starts again for @${username1}.`,
    (username1, username2) => `💎 The Black Diamond changes hands. @${username2} walks away empty-handed. @${username1} just bought themselves 30 minutes!`,
    (username1, username2) => `💎 Textbook! @${username1} is in, takes the diamond from @${username2}, and disappears back into the crowd. The trace follows.`,
    (username1, username2) => `💎 @${username1} moves like a shadow behind @${username2} — and the Black Diamond is suddenly gone.`,
    (username1, username2) => `💎 No alarms. No hesitation. @${username1} simply replaces @${username2}'s possession with absence.`,
    (username1, username2) => `💎 The handoff is so smooth even the system hesitates. @${username2} is now missing something important.`,
    (username1, username2) => `💎 @${username1} executes the swap perfectly. @${username2} only realizes after the system does.`,
    (username1, username2) => `💎 A blink is all it takes. @${username1} leaves @${username2} holding nothing but history.`,
    (username1, username2) => `💎 The Black Diamond is re-assigned mid-motion. @${username2} never sees @${username1} approach.`,
  ],

  STEAL_SELF_MESSAGES : [
    (username) => `@${username} attempts to steal from themselves. The Black Diamond remains exactly where it was.`,
    (username) => `@${username} is their own target apparently. The crew doesn't know what to say.`,
    (username) => `@${username} tries to steal the Black Diamond from @${username}. This investigation is ongoing.`,
    (username) => `@${username} reached into their own pocket. Found the diamond. It was theirs the whole time. Nothing happened.`,
    (username) => `The Black Diamond was stolen from @${username} by @${username}. We're all just going to move past this.`,
    (username) => `@${username} steals the Black Diamond from @${username}. Case solved!`
  ],

  STEAL_FAIL_MESSAGES : [
    (username1, username2) => `❌ @${username1} gets within reach — then @${username2} shifts. The moment is gone. The diamond doesn't move.`,
    (username1, username2) => `❌ @${username2} feels the approach. Adjusts. @${username1} pulls back before the sensors flag the contact. The diamond stays put.`,
    (username1, username2) => `❌ Too slow. @${username2} clocked @${username1} three steps out. The Black Diamond isn't going anywhere.`,
    (username1, username2) => `❌ @${username1} had the angle. Didn't have the timing. @${username2} holds on. The clock keeps running.`,
    (username1, username2) => `❌ The approach was good. The execution wasn't. @${username2} tightens their grip and @${username1} walks away empty handed.`
  ],

  STEAL_DROP_MESSAGES : [
    (username1, username2) => `⚠️ @${username1} grabs for it — @${username2} doesn't let go. The struggle lasts two seconds. The Black Diamond hits the marble floor! Security cameras catch everything.`,
    (username1, username2) => `⚠️ Too aggressive. @${username1} and @${username2} both reach for it at the same time. Neither wins. The diamond is on the floor! The gallery is watching.`,
    (username1, username2) => `⚠️ @${username2} fights back hard. @${username1} wasn't expecting that. The Black Diamond slips from both of them and skids across the gallery floor!`,
    (username1, username2) => `⚠️ The struggle between @${username1} and @${username2} ends badly for everyone. The diamond drops. The biometric trace goes cold. It's anyone's game!`,
    (username1, username2) => `⚠️ @${username2} wasn't going quietly. Cost them both. The Black Diamond is on the floor and the clock has reset. Move fast!`,
    (username1, username2) => `⚠️ @${username1} and @${username2} collide mid-action — the Black Diamond is dropped instantly.`,
    (username1, username2) => `⚠️ The grab becomes a standoff becomes a mess. The Black Diamond breaks free and hits the floor.`,
    (username1, username2) => `⚠️ Neither backs down. Both commit. The system resolves it the only way it can: drop confirmed.`,
    (username1, username2) => `⚠️ @${username1} pulls, @${username2} resists — the diamond chooses neither and falls.`,
    (username1, username2) => `⚠️ A failed steal turns into a struggle. A struggle turns into a drop. The Black Diamond is loose again.`,
    (username1, username2) => `⚠️ The gallery registers simultaneous intent. The Black Diamond cannot exist in both states — it drops.`,
    (username1, username2) => `⚠️ @${username1} and @${username2} create a paradox of possession. The system rejects both claims.`,
    (username1, username2) => `⚠️ Hands meet. Force increases. The Black Diamond exits the equation entirely.`,
    (username1, username2) => `⚠️ The moment escalates too fast to track cleanly. The Black Diamond is now on the floor, unresolved.`,
    (username1, username2) => `⚠️ @${username2} counters, @${username1} overcommits — the artifact slips into open space.`,
    (username1, username2) => `⚠️ A contested grab collapses into chaos. The Black Diamond impacts the floor with authority.`,
    (username1, username2) => `⚠️ The system logs conflicting inputs from @${username1} and @${username2}. Output: DROP.`,
    (username1, username2) => `⚠️ No winner. No control. Just impact — the Black Diamond is loose again.`,
  ],

  STEAL_INVALID_MESSAGES : [
    (username1, username2) => `❌ @${username1} moves on @${username2} — but @${username2} isn't holding the Black Diamond. Wrong target. @${username2} walks away with a hazard bonus for the trouble. +1 point.`,
    (username1, username2) => `❌ @${username1} cases @${username2} and makes the approach. @${username2} has nothing. The real holder is still out there. @${username2} collects compensation for the interruption. +1 point.`,
    (username1, username2) => `❌ Sloppy intel, @${username1}. @${username2} was never holding the Black Diamond. They didn't even break a sweat. +1 point for @${username2}'s trouble.`,
    (username1, username2) => `❌ @${username1} picked the wrong mark. @${username2} wasn't holding anything — and now they're +1 point richer for the inconvenience.`,
    (username1, username2) => `❌ @${username2} gets a free point tonight, courtesy of @${username1}'s poor reconnaissance. The Black Diamond is still out there. Pay attention.`,
    (username1, username2) => `❌ SYSTEM NOTICE: @${username2} was not in possession of the Black Diamond. @${username1}'s attempt has been logged as "misdirected." +1 point awarded.`,
    (username1, username2) => `❌ @${username1} executes a perfect steal... on the wrong person. @${username2} benefits from the confusion. +1 point.`,
    (username1, username2) => `❌ Intelligence failure detected. @${username2} was a false lead. Compensation issued. +1 point.`,
    (username1, username2) => `❌ @${username1} commits to a target that the system immediately disavows. @${username2} receives apology points. +1.`,
    (username1, username2) => `❌ There was never a Black Diamond here. @${username2} was simply living their life. +1 point for emotional damages.`,
    (username1, username2) => `❌ @${username1} reads the room incorrectly. @${username2} was not part of this narrative branch. +1 point granted.`,
    (username1, username2) => `❌ The accusation collapses under inspection. @${username2} is cleared of all involvement — and rewarded for it.`,
    (username1, username2) => `❌ @${username1} targets @${username2}, but the Black Diamond was never in this scene. Wrong instance. +1 point.`,
    (username1, username2) => `❌ Security audit complete: @${username2} had no connection to the artifact. @${username1}'s attempt is marked as "misfire." +1 point.`,
    (username1, username2) => `❌ @${username2} stands there confused as they are awarded +1 point for a crime they did not commit.`,
    (username1, username2) => `❌ False positive. @${username1} engaged the wrong entity. @${username2} receives compensation for inconvenience.`,
    (username1, username2) => `❌ The Black Diamond was never here. @${username2} is simply collateral in a mistaken narrative thread. +1 point.`,
  ],

  STEAL_INVALID_TARGET_MESSAGES : [
    (username) => `@${username} picks a target that doesn't exist. Solid plan.`,
    (username) => `@${username} cases someone who isn't even in the system. Back to the drawing board.`,
    (username) => `No record of that target. @${username} just robbed a ghost.`,
    (username) => `@${username} named a name nobody recognises. The crew is confused.`,
    (username) => `That person isn't in the system. @${username} wasted a perfectly good attempt.`,
    (username) => `@${username} no such operative exists. If chat startes inventing imaginary players again, I'm logging off.`,
    (username) => `❌ The system checks the roster... nothing. @${username} attempted interaction with a non-existent entity.`,
    (username) => `❌ @${username} tries to initiate a steal on an empty entry. The void does not respond.`,
    (username) => `❌ Target not found. @${username} appears to be playing a different version of the game.`,
    (username) => `❌ @${username} attempts contact with someone who was never loaded into this session.`,
    (username) => `❌ ERROR: invalid target. @${username} has briefly broken narrative continuity.`,
    (username) => `❌ The Black Diamond watches silently as @${username} argues with an imaginary opponent.`,
    (username) => `❌ @${username} selects “???”. The system cannot steal from uncertainty.`,
    (username) => `❌ No match found. @${username} is now negotiating with a hallucination.`,
    (username) => `❌ The gallery does not recognize this name. @${username} must be referring to another heist timeline.`,
    (username) => `❌ @${username} reaches into the void and finds nothing willing to be stolen.`,
    (username) => `❌ Invalid target confirmed. @${username} successfully interacted with fiction.`,
    (username) => `❌ I checked twice. Then I checked angrily. @${username}, that target does not exist.`,
    (username) => `❌ The roster remains unchanged. @${username} is arguing with an empty chair and losing.`,
  ],

  STEAL_TEAMMATE_MESSAGES : [
    (username1, username2) => `❌ @${username1} tries to steal from their own teammate @${username2}. That's not how this works, @${username1}!`,
    (username1, username2) => `❌ @${username1} reaches for the Black Diamond... but it's with their own teammate @${username2}. Awkward!`,
    (username1, username2) => `❌ @${username1} moves on @${username2} — then notices the badge. Same crew. This stays between them... and now, also chat.`,
    (username1, username2) => `❌ @${username1} gets halfway there before realising @${username2} is on their side. Awkward. Nobody saw that!`,
    (username1, username2) => `❌ @${username1} and @${username2} are on the same team. Use !pass. This isn't that kind of heist.`,
    (username1, username2) => `❌ @${username1} almost robbed their own teammate. @${username2} is not impressed. The group leader facepalms.`,
    (username1, username2) => `❌ That's friendly fire, @${username1}. @${username2} is with you. Save it for the others!`,
    (username1, username2) => `❌ @${username1} attempts to rob their own teammate @${username2}... HR would like a word.`,
    (username1, username2) => `❌ @${username1} forgets momentarily that teamwork exists. @${username2} stares in silence.`,
    (username1, username2) => `❌ The Black Diamond isn't the problem. @${username1} is trying to loot their own side again.`,
    (username1, username2) => `❌ @${username2} checks their own badge just to confirm they're still allied with @${username1}. They are. Unfortunately.`,
    (username1, username2) => `❌ SYSTEM NOTE: teammates cannot be targeted. @${username1} has been gently corrected.`,
    (username1, username2) => `❌ @${username1} briefly becomes the villain in their own friendship arc.`,
    (username1, username2) => `❌ @${username2} survives the heist... and also survives being almost betrayed by @${username1}.`,
    (username1, username2) => `❌ A moment of confusion. @${username1} tries to steal from @${username2}, but shared objectives intervene.`,
    (username1, username2) => `❌ @${username1} is reminded that this is a team-based crime scenario.`,
    (username1, username2) => `❌ The system refuses the action. Not because it's impossible — but because it would be embarrassing.`,
    (username1, username2) => `❌ @${username1} experiences brief cognitive dissonance: “enemy...? wait no.” @${username2} is still their teammate.`,
    (username1, username2) => `❌ @${username1} attempts internal conflict. The party does not support this narrative direction.`,
    (username1, username2) => `❌ @${username2} remains loyal. @${username1} remains confused. The Black Diamond remains irrelevant to this mistake.`
  ],

  NOTHING_TO_STEAL_MESSAGES : [
    (username) => `@${username} tries to steal the Black Diamond — but Black Diamond is still secured in the vault.`,
    (username) => `@${username} makes a move for the Black Diamond, but it's not on the floor. It's still locked up tight!`,
    (username) => `@${username} attempts a steal, but the Black Diamond isn't in play. It's still safe in the vault!`,
    (username) => `@${username} goes for the Black Diamond, but it's not on the floor. The vault holds strong!`,
    (username) => `@${username} tries to steal the Black Diamond, but it's still secure. No heist for you!`
  ],

  PASS_SUCCESS_MESSAGES: [
    (username1, username2, factionName) => `💎 @${username1} makes the handoff. @${username2} takes possession. ${factionName} keeps the Black Diamond in play!`,
    (username1, username2, factionName) => `💎 Smooth transfer! @${username1} to @${username2}. ${factionName} stays in control.`,
    (username1, username2, factionName) => `💎 @${username1} trusts @${username2} with the Black Diamond. ${factionName} moves it quietly!`,
    (username1, username2, factionName) => `💎 The Black Diamond changes hands within ${factionName}. @${username1} passes to @${username2}. Smart play!`,
    (username1, username2, factionName) => `💎 @${username1} gets it to @${username2} without a sound. ${factionName} keeps their grip on the job!`,
    (username1, username2, factionName) => `💎 No hesitation. @${username1} signals, @${username2} receives. ${factionName} executes cleanly.`,
    (username1, username2, factionName) => `💎 The Black Diamond moves like it was always meant to be there — now in the hands of @${username2}.`,
    (username1, username2, factionName) => `💎 A quiet exchange in the middle of chaos. @${username1} → @${username2}. ${factionName} stays invisible.`,
    (username1, username2, factionName) => `💎 @${username1} never stops walking. @${username2} never stops watching. The pass completes seamlessly.`,
    (username1, username2, factionName) => `💎 The transfer happens in the gap between attention spans. ${factionName} maintains control.`,
    (username1, username2, factionName) => `💎 @${username2} is now in possession. @${username1} is already gone. ${factionName} stays fluid.`,
    (username1, username2, factionName) => `💎 The Black Diamond is redistributed within ${factionName} like it's part of standard procedure.`,
    (username1, username2, factionName) => `💎 @${username1} completes the pass. @${username2} locks in the carry. The system barely notices.`,
    (username1, username2, factionName) => `💎 A handoff so smooth it almost doesn't register. ${factionName} continues the operation uninterrupted.`,
    (username1, username2, factionName) => `💎 @${username1} offloads responsibility. @${username2} accepts it. ${factionName} remains stable.`,
    (username1, username2, factionName) => `💎 The Black Diamond moves through ${factionName} like a relay signal in a dead zone — uninterrupted.`,
    (username1, username2, factionName) => `💎 Coordination confirmed. @${username1} to @${username2}. ${factionName} is still one step ahead of the system.`
  ],

  PASS_NOT_HOLDER_MESSAGES: [
    (username) => `❌ @${username} tries to pass the Black Diamond. They don't have the Black Diamond. Whoops!`,
    (username) => `❌ @${username} reaches into their pocket. Finds nothing. The Black Diamond is not yours to pass!`,
    (username) => `❌ Bold of @${username} to pass something they're not holding. The crew is concerned...`,
    (username) => `❌ @${username} you don't have it. You never had it. Please sit down.`,
    (username) => `❌ The Black Diamond is not in @${username}'s possession. This is not up for debate.`,
    (username) => `❌ @${username} attempts to initiate a pass sequence with zero inventory. The system is confused.`,
    (username) => `❌ PASS FAILED: @${username} is not currently in possession of anything remotely passable.`,
    (username) => `❌ @${username} gestures dramatically... at empty hands.`,
    (username) => `❌ The Black Diamond checks itself. It confirms it is not with @${username}.`,
    (username) => `❌ @${username} tries to pass air. Air is not tradable in this system.`,
    (username) => `❌ Inventory check: @${username} has nothing. Attempted pass cancelled.`,
    (username) => `❌ @${username} is performing advanced team coordination on an item they do not own.`,
    (username) => `❌ The crew pauses. @${username} has attempted to distribute an item that does not exist in their hands.`,
    (username) => `❌ SYSTEM OVERRIDE: You cannot pass what you are not holding. Nice try, @${username}.`,
    (username) => `❌ @${username} briefly enters a parallel reality where they had the Black Diamond. We are not in that timeline.`,
    (username) => `❌ The Black Diamond remains unaffected by @${username}'s attempt to socially distribute it.`,
    (username) => `❌ @${username} opens the pass menu. The pass menu closes itself.`,
    (username) => `❌ The action completes successfully. Unfortunately, @${username} was not involved in the prerequisite condition.`
  ],

  PASS_WRONG_FACTION_MESSAGES: [
    (username1, username2) => `❌ @${username1} just tried to hand the Black Diamond to the enemy. @${username2} is not on your crew. Did you even read the briefing?`,
    (username1, username2) => `❌ @${username1}. @${username2} is not your teammate. The diamond stays where it is. Please pay attention.`,
    (username1, username2) => `❌ Bold strategy from @${username1} — handing the Black Diamond directly to the opposition. Truly remarkable. The diamond stays put.`,
    (username1, username2) => `❌ @${username1} attempts to pass to @${username2}. A rival. In front of everyone. The crew is having a meeting after this.`,
    (username1, username2) => `❌ @${username1} that was either a mistake or a betrayal. Either way, @${username2} isn't getting the diamond. Check your roster.`,
    (username1, username2) => `❌ @${username1} tries to hand the Black Diamond directly to the enemy. That's not a pass. That's surrender!`,
    (username1, username2) => `❌ @${username1}, I cannot stress this enough: they're the other team!`,
    (username1, username2) => `❌ SYSTEM ALERT: @${username2} is not in your faction. @${username1}'s action has been blocked for national security reasons.`,
    (username1, username2) => `❌ @${username1} looks at roster. Looks at @${username2}. Ignores roster.`,
    (username1, username2) => `❌ The Black Diamond refuses the transfer. Even the artifact knows @${username2} is hostile.`,
    (username1, username2) => `❌ @${username1} just attempted inter-faction logistics with zero clearance.`,
    (username1, username2) => `❌ There was a plan. There was a team. @${username1} has chosen chaos.`,
    (username1, username2) => `❌ @${username2} waves politely as the system rejects the pass. Wrong side of the heist.`,
    (username1, username2) => `❌ This is not a misunderstanding. @${username2} is explicitly not on your side.`,
    (username1, username2) => `❌ @${username1} attempts diplomacy through artifact transfer. The system does not recognize this strategy.`,
    (username1, username2) => `❌ The crew collectively pauses. @${username1} is passing to the wrong faction again.`,
    (username1, username2) => `❌ @${username1} has confused “ally” with “enemy with a username.”`,
    (username1, username2) => `❌ PASS DENIED: faction mismatch detected. @${username2} flagged as opposing force.`,
    (username1, username2) => `❌ @${username1} successfully identifies a target. Unfortunately, it is the wrong category of target.`,
    (username1, username2) => `❌ The Black Diamond remains with the original holder. @${username1}'s attempted alliance shift is rejected.`
  ],

  PASS_SELF_MESSAGES: [
    (username) => `@${username} tries to pass the Black Diamond... to themselves. The crew has no words.`,
    (username) => `@${username} that's not a pass. That's just standing there holding it. Nothing has changed.`,
    (username) => `@${username} attempts a self-pass. The Black Diamond remains exactly where it was... as expected.`,
    (username) => `@${username} is passing to @${username}. This is not how passing works. This is not how any of this works!`,
    (username) => `The Black Diamond went from @${username} to @${username}. Incredible. Nothing changed.`,
    (username) => `Excellent pass. @${username} hands the Black Diamond to... @${username}. Slow clap.`,
    (username) => `@${username} has successfully transferred ownership from themselves... to themselves. Incredible efficiency.`,
    (username) => `@${username} is passing the Black Diamond to themselves. The crew is unsure how to react.`,
    (username) => `SYSTEM CHECK: @${username} attempted a transfer loop. Result: unchanged state.`,
    (username) => `@${username} executes the most secure pass possible: no movement at all.`,
    (username) => `The Black Diamond confirms it has not changed hands. It remains with @${username}.`,
    (username) => `@${username} performs administrative paperwork on themselves. No gameplay effect detected.`,
    (username) => `PASS VALIDATED. Recipient: @${username}. Sender: @${username}. Outcome: identical.`,
    (username) => `The system briefly considers this action. Then decides it is philosophical, not mechanical.`,
    (username) => `@${username} has discovered a loophole where nothing happens forever.`,
    (username) => `This action is technically correct. Unfortunately, it is also meaningless.`,
    (username) => `@${username} enters a closed loop of possession. The Black Diamond remains emotionally unchanged.`,
    (username) => `The DM checks notes. The notes say: “yep, still @${username}.”`,
    (username) => `No transfer occurred. But @${username} feels like something happened.`,
    (username) => `The Black Diamond refuses to acknowledge this interaction as a pass.`,
    (username) => `@${username} achieves quantum possession: both holding and not holding, which resolves to holding.`
  ],

  PASS_INVALID_TARGET_MESSAGES: [
    (username1) => `@${username1} tries to pass to someone who doesn't exist. The diamond stays put.`,
    (username1) => `No record of that operative, @${username1}. Pass cancelled.`,
    (username1) => `@${username1} passed to a ghost. Again. The diamond isn't moving.`,
    (username1) => `That person isn't in the system, @${username1}. Double check the name and try again.`
  ],

  PASS_BACK_MESSAGES: [
    (username1, username2) => `❌ @${username1} tries to pass back to @${username2}. @${username2} just handed it to you. Move it forward.`,
    (username1, username2) => `❌ @${username1} reaches back to @${username2}. That's not how you run a clean operation. Find another hand.`,
    (username1, username2) => `❌ The Black Diamond doesn't go backwards, @${username1}. @${username2} already did their part.`,
    (username1, username2) => `❌ @${username1} tries to return the diamond to @${username2}. This is a heist, not a lost and found. Keep it moving.`,
    (username1, username2) => `❌ @${username2} passed it to you for a reason, @${username1}. Don't hand it straight back. The crew is watching.`,
    (username1, username2) => `❌ BACKPASS DETECTED: @${username1} → @${username2}. The system refuses circular movement.`,
    (username1, username2) => `❌ @${username1}, that's a rollback. We don't do rollback heists.`,
    (username1, username2) => `❌ The Black Diamond rejects redundancy. @${username1}, choose a new direction.`,
    (username1, username2) => `❌ @${username2} already contributed. The system is not accepting return policies.`,
    (username1, username2) => `❌ Loop detected between @${username1} and @${username2}. Operation momentum preserved by force.`,
    (username1, username2) => `❌ That exchange was already completed once. The Black Diamond refuses replay scenes.`,
    (username1, username2) => `❌ @${username1} attempts to undo progress. The crew declines the timeline rollback.`,
    (username1, username2) => `❌ You can't pass backwards in a forward-moving operation, @${username1}.`,
    (username1, username2) => `❌ The system identifies this as "stagnation behavior." It does not approve.`,
    (username1, username2) => `❌ @${username1} tries to recycle a completed interaction. Nothing changes.`,
    (username1, username2) => `❌ The Black Diamond has already experienced this exact sequence. It declines repetition.`,
    (username1, username2) => `❌ @${username1}, keep the momentum. The operation is allergic to backtracking.`,
    (username1, username2) => `❌ DM NOTE: forward progression required. @${username1}'s action has been redirected.`
  ],

  ROUND_END_MESSAGES: [
    (username, factionName) => `💎 That's a wrap! @${username} of ${factionName} holds the Black Diamond as the dust settles. +5 points. Well played.`,
    (username, factionName) => `💎 The round is over. @${username} kept their grip to the end. ${factionName} walks away with the bonus. +5 points.`,
    (username, factionName) => `💎 @${username} outlasted everyone. ${factionName} takes the round. The Black Diamond and +5 points are theirs.`,
    (username, factionName) => `💎 When the smoke cleared, @${username} was still holding. ${factionName} claims the round bonus. +5 points.`,
    (username, factionName) => `💎 The Black Diamond stays with @${username} as the round closes. ${factionName} earns the +5. Don't spend it all in one place.`
  ],

  DIAMOND_DROP_MESSAGE: [
    () => `💎 The Black Diamond hits the floor! First one to !grab it claims it!!`
  ],

  DIAMOND_WARNING_MESSAGE: [
    () => `⚠️ The Black Diamond's security signature is destabilizing. Someone's grip is slipping — the floor is about to get very interesting!`
  ]
};