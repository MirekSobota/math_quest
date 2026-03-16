# Latest polish pass

## UX / layout
- simplified the first screen and removed the confusing extra icon rows
- removed the duplicated `Play` presence from the hero area
- kept one clear main CTA only
- tightened the battle layout for short mobile landscape screens
- reduced topbar, question card and answer button height for phone landscape
- constrained monster image height so the enemy name no longer sits behind the sprite
- moved the enemy name into its own pill above the image for better readability
- changed the hint action from `USE` to `Hint`
- reduced meaningless floating copy during normal hits

## Combat readability
- spell feedback is now shown in the HUD as icon + bonus damage instead of barely visible `Fireball` text
- floating message styling is more compact and readable
- question card now uses less copy and more focus on the math itself

## Audio
- added support for a real MP3 boss-win track
- wired the currently available uploaded MP3 as the temporary boss victory clip
- kept synthetic fallback sounds for click/correct/wrong/game over

## Notes
- only one MP3 file was available in the workspace (`lose.mp3`), so that file was used as the temporary boss-win track slot
- when the remaining 2 audio files are uploaded, they can be mapped cleanly in the same sound system
