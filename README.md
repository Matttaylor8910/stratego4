Flow


Need to figure out:
NICE TO HAVE Showing which pieces remain????

Placement phase components:
- Tray
  - Created copy of game.map.pieces so it knows what the user can placement
  -


1) start home page
2) player sets name of the game
  2a) GAME IS CREATED IN DB and player is routed to game/:id
  2b) if the id already existed, just send them to that game
  2c) server sets the phase to 'join'
  2d) show "starting game" toast or message while user is waiting
3) player sends url to friends or friends just type the id in the box
4) players click the play button next to a team on the map
  4a) toss user's userId into userIds
  4b) add the user's userId to game.map.players onto the player they wanted to join
  4c) server sets the phase to 'placement' when all players have userIds
5) players are looking at blank map and need to set pieces
  5a) player clicks on their own colored tile, it gets highlighted
  5b) player clicks on piece out of the starting tray
  5c) keep track of pieces to generate the inital player position
6)