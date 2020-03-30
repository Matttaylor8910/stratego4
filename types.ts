// collection at /games/{gameId}
// the game
export interface Game {
  players: String[];  // array of playerIds of those playing
  scoreboard: Scoreboard;
  map: Map;
}

// each tile can emit its own stuff
// /games/{gameId}/tiles/{tileId}

// /games/{gameId}/positions/{playerId}
// cannot be edited except by server
export interface PlayerPosition {
  playerId: String;
  piece: Piece;
  coordinate: Coordinate;
}

// /games/{gameId}/moves/{docId}
// only allow create in this collection
export interface Move {
  from: Coordinate;
  to: Coordinate;
  piece: Piece;
  playerId: String;
}

// cannot be edited except by server
export interface Scoreboard {
  players: {player: Player, score: number}[];
}

// collection at /maps/{mapId} (we can build more maps later)
// can be edited by the creator
export interface Map {
  name: String;
  width: number;
  height: number;

  // all tiles to be rendered on the map
  tiles: Tile[];
}

export interface Tile {
  coordinate: Coordinate;
  inPlay: boolean;  // set to false to make it a square you cannot move to

  // null is empty
  playerId: string|null;
}

export interface Piece {
  playerId: String;  // the player controlling this unit
  name: String;      // general, flag, bomb, 2, 3, etc
  capturePoints: number;
}

// collection at /players/{playerId}
export interface Player {
  name: String;
}


export interface Coordinate {
  row: number;
  col: number;
}
