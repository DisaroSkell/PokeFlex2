# PokeFlex2 - Backlog

## Feat:
- Reponsive
- Add "toggle all" button in gen selector
- Warning that setting will reset streak
- Statistics page
- Chain Quiz evolution
- Improve "hint" on wrong try
- "reveal"/"hint" button ?
- Create a custom select (because style can't be updated) and see if it works with keyboard
- White mode
- Streak specific action (on 10, 100, etc.)
- Change favicon (randomize or gen selected count) => endpoint item + check "ball" in name
- Pokémon collection (adds it when you guess it correct once, you can have them shiny etc.)
- Bellsprout feedbacks "Nice"
- Machoke feedbacks "SIX SEVEN"
- Choisir les sprites
- Seeding + Daily
- Option => mute sounds
- Fading notif for good/bad guesses (will free space in guess container)

## Fix:
- Allow spaces and simple quotes in text field for pokemons
- When giving up for pokémon types, it says "its type(s) was/were [types]" but it would be better if it said "[pokemon]'s type(s) is/are [types]"
- Fairy type shouldn't exist when max gen is lower than 6 (add text to explain this to users)
- Footer with info for Pokemon Company and stuff (check pkmnquiz)
- Preload sounds (?)
- Time flies even when image is still loading
- Shiny can go away if dom changes => Shiny should be an attribute of the mon when you get it
- ESLint errors
- When switching language, confirm button sometimes doesn't confirm and you have to press it twice
