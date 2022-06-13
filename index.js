const {
  getRandomGameState,
  getEmptyBoard,
  getEmptyHitCountsObject,
  isEndGame,
  getOtherPlayer,
  validCell,
  directions,
} = require('./helpers');
const {
  Status, AttackTypes, MoveTypes, Ships,
} = require('./types');

/**
 * Generic board game types
 * @type BoardGame: json object, in the format of
 * {
 *  // creator read write fields
 *  state: json object, which represents any board game state
 *  joinable: boolean (default=true), whether or not the room can have new players added to it
 *  finished: boolean (default=false), when true there will be no new board game state changes
 *
 *  // creator read only
 *  players: [string], array of unique playerIds
 *  version: Number, an integer value that increases by 1 with each state change
 * }
 * @type BoardGameResult: json object, in the format of
 * {
 *  // fields that creator wants to overwrite
 *  state?: json object, which represents any board game state
 *  joinable?: boolean, whether or not the room can have new players added to it
 *  finished?: boolean, when true there will be no new board game state changes
 * }
 */

/**
 * onRoomStart
 * @returns {BoardGameResult}
 */
function onRoomStart() {
  return {
    state: {
      status: Status.PreGame,
      board: {},
      attackBoard: {},
      hitCounts: {},
      playersReady: 0,
      plrIDToMove: null,
      winner: null,
    },
  };
}

/**
 * onPlayerJoin
 * @param {string} plr string, which represents the player id
 * @param {BoardGame} currentGame
 * @returns {BoardGameResult}
 */
function onPlayerJoin(plr, boardGame) {
  const { players, state } = boardGame;

  if (state.status !== Status.PreGame) {
    throw new Error('The game has already started!');
  }

  state.board[plr.id] = getRandomGameState();
  state.attackBoard[plr.id] = getEmptyBoard(AttackTypes.None);
  state.hitCounts[plr.id] = getEmptyHitCountsObject();

  if (players.length === 2) {
    state.plrIDToMove = players[0].id;

    return {
      state,
      joinable: false,
    };
  }

  return {
    state,
    joinable: true,
  };
}

/**
 * onPlayerMove
 * @param {string} plr string, which represents the player id
 * @param {*} move json object, controlled the creator that represents the player's move
 * @param {BoardGame} currentGame
 * @returns {BoardGameResult}
 */
function onPlayerMove(plr, move, boardGame) {
  const { state, players } = boardGame;
  const {
    board, attackBoard, hitCounts, plrIDToMove,
  } = state;

  const otherPlrID = getOtherPlayer(players, plr.id).id;

  const { moveType } = move;

  if (moveType === MoveTypes.InitializeBoard) {
    if (state.Status === Status.InGame) {
      throw new Error('The game has already started!');
    }

    const { playerBoard } = move;
    board[plr.id] = playerBoard;
    state.playersReady += 1;

    if (state.playersReady === players.length) {
      state.status = Status.InGame;
    }
  } else if (moveType === MoveTypes.Attack) {
    if (state.status === Status.PreGame) {
      throw new Error("The game hasn't started!");
    } else if (plrIDToMove !== plr.id) {
      throw new Error("It's not your turn! Waiting on other player.");
    }

    const sinkShip = (x, y, opponentCell) => {
      if (
        validCell(x, y, board[plr.id])
        && board[otherPlrID][x][y] === opponentCell
        && attackBoard[plr.id][x][y] !== AttackTypes.Sunk
      ) {
        attackBoard[plr.id][x][y] = AttackTypes.Sunk;

        directions.forEach((direction) => {
          sinkShip(x + direction[0], y + direction[1], opponentCell);
        });
      }
    };

    const { attack } = move;
    const [x, y] = attack;

    if (attackBoard[plr.id][x][y] !== AttackTypes.None) {
      throw new Error("You've already attacked this cell!");
    }

    const opponentCell = board[otherPlrID][x][y];
    if (opponentCell !== null) {
      hitCounts[plr.id][opponentCell] += 1;

      if (hitCounts[plr.id][opponentCell] === Ships[opponentCell]) {
        sinkShip(x, y, opponentCell);
      } else {
        attackBoard[plr.id][x][y] = AttackTypes.Hit;
      }
    } else {
      attackBoard[plr.id][x][y] = AttackTypes.Miss;
    }

    if (isEndGame(hitCounts[plr.id])) {
      state.status = Status.EndGame;
      state.winner = plr.id;
      return { state, finished: true };
    }

    state.plrIDToMove = otherPlrID;
  }

  return { state };
}

/**
 * onPlayerQuit
 * @param {string} plr string, which represents the player id
 * @param {BoardGame} currentGame
 * @returns {BoardGameResult}
 */
function onPlayerQuit(plr, boardGame) {
  const { state, players } = boardGame;
  state.status = Status.EndGame;

  if (players.length === 1) {
    const [winner] = players;
    state.winner = winner;

    return {
      state,
      joinable: false,
      finished: true,
    };
  }

  return { joinable: false, finished: true };
}

module.exports = {
  onRoomStart,
  onPlayerJoin,
  onPlayerMove,
  onPlayerQuit,
};
