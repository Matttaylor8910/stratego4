// collection at /games/{gameId}
// can be created by anyone
// cannot be edited except by server
export interface Game {
  id: string;
  name: string;

  // this property will change to reflect the different phases as they happen,
  // obviously non-editable except by server
  phase?: 'join'|'placement'|'playing'|'complete';

  // generated onCreate by a cloud function, updated by requests
  // subcollection array of userIds of those playing, used for
  // querying/permissions only people playing can post to /moves
  // subcollection
  userIds?: string[];

  // generated onCreate by a cloud function
  // includes the score, and the turn counter
  state?: GameState;

  // generated onCreate by a cloud function, pull the default map for now
  // the data necessary to render the players colors on the map, excluding the
  // information about what piece is there
  board?: Map;
}

// /games/{gameId}/positions/{userId}
// users can create (one time at the start)
// cannot be edited afterward, except by server
// C - one time
// R - errybody
// U - no one but server
// D - never
export interface PlayerPosition {
  // '3,4': 'S' for example to denote the spy is at row 3, col 4
  [coordinate: string]: string;
}

// /games/{gameId}/moves/{docId}
// only allow create in this collection and only if you're in the game
export interface Move {
  from: Coordinate;
  to: Coordinate;
  rank: string;
  userId: string;
  createdAt: number;
}

// /games/{gameId}/requests/{docId}
export interface JoinRequest {
  userId: string;
  index: number;
}

// cannot be edited except by server
export interface GameState {
  // just a simply score
  players: {
    userId: string,
    score: number,
  }[];

  // start at 0 (display as + 1)
  turn: number;
}

// /maps/{mapId} (we can build more maps later)
// This is just the collection of available maps to choose from when starting a
// game. Users can create maps and come back later to tweak settings and layout.
//
// NOTE: after a map is selected as the map for a game, it just gets copied onto
// the game document and is edited by the server from then on out to keep one
// source of truth.
export interface Map {
  // Show name in UI for picking maps (later feature)
  name: string;

  // can be any width and height
  width: number;
  height: number;

  // the visual state of where which tiles the player occupies
  players: {
    color: string,              // hex value
    coordinates: Coordinate[],  // starting positions

    // if userId is not set, then show a play button
    userId?: string,
    phase?: 'placement'|'playing'|'eliminated'|'winner',
  }[];

  pieces: PiecesMap;

  // all tiles that cannot be visited when playing
  offLimits: Coordinate[];
}

// pieces is a map of several shortNames that correspond to the number of that
// piece allowed
// {
//   'S': 1,
//   'B': 2,
//   'F': 1,
//   '2': 3,
// }
export interface PiecesMap {
  [rank: string]: number;
}

// /pieces/{docId}
// export interface Piece {
//   name: string;           // General, Flag, Bomb, Spy, 2, 3, etc
//   shortName: string;      // G, F, B, S, 2, 3, etc
//   capturePoints: number;  // increment score by when captured
// }

// collection at /users/{userId}
export interface User {
  id: string;
  name?: string;
  email?: string;
  photoURL?: string;
}


export interface Coordinate {
  row: number;
  col: number;
}
