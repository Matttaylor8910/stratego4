Flow


Need to figure out:
NICE TO HAVE Showing which pieces remain????

Placement phase components:
- Tray
  - Created copy of game.map.pieces so it knows what the user can placement
  -

4) players click the play button next to a team on the map
  4a) toss user's userId into userIds
  4b) add the user's userId to game.map.players onto the player they wanted to join
  4c) server sets the phase to 'placement' when all players have userIds
5) players are looking at blank map and need to set pieces
  5a) player clicks on their own colored tile, it gets highlighted
  5b) player clicks on piece out of the starting tray
  5c) keep track of pieces to generate the inital player position
6)