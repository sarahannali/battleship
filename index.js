const {
  getRandomGameState, getEmptyBoard, getEmptyHitCountsObject, ships,
} = require('./helpers');

// TicTacToe Example
const Status = Object.freeze({
  PreGame: 0,
  InGame: 1,
  EndGame: 2,
});

const MoveTypes = Object.freeze({
  InitializeBoard: 0,
  Attack: 1,
});

const AttackTypes = Object.freeze({
  None: 0,
  Miss: 1,
  Hit: 2,
  Sunk: 3,
});

const getOtherPlayer = (players, currentPlayerID) => players
  .find((plr) => plr.id !== currentPlayerID);

// function getPlrFromMark(mark, plrs) {
//   return mark === 'X' ? plrs[0] : plrs[1];
// }

// function isWinningSequence(arr) {
//   return arr[0] != null && arr[0] === arr[1] && arr[1] === arr[2];
// }

// function isEndGame(board, plrs) {
//   // check if there is a winner
//   for (let i = 0; i < board.length; i += 1) {
//     const row = board[i];
//     const col = [board[0][i], board[1][i], board[2][i]];

//     if (isWinningSequence(row)) {
//       return [true, getPlrFromMark(row[0], plrs)];
//     } if (isWinningSequence(col)) {
//       return [true, getPlrFromMark(col[0], plrs)];
//     }
//   }

//   const d1 = [board[0][0], board[1][1], board[2][2]];
//   const d2 = [board[0][2], board[1][1], board[2][0]];
//   if (isWinningSequence(d1)) {
//     return [true, getPlrFromMark(d1[0], plrs)];
//   } if (isWinningSequence(d2)) {
//     return [true, getPlrFromMark(d2[0], plrs)];
//   }

//   // check for tie
//   if (board.some((row) => row.some((mark) => mark === null))) {
//     return [false, null];
//   }
//   return [true, null];
// }

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
      winner: null, // null means tie if game is finished, otherwise set to the plr that won
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

  // VALIDATIONS
  // check if game has started
  if (state.status !== Status.PreGame) {
    throw new Error("game has already started, can't join the game!");
  }

  state.board[plr.id] = getRandomGameState();
  state.attackBoard[plr.id] = getEmptyBoard(AttackTypes.None);
  state.hitCounts[plr.id] = getEmptyHitCountsObject();

  if (players.length === 2) {
    state.plrToMoveIndex = 0;
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
    board, attackBoard, hitCounts,
  } = state;

  const otherPlrID = getOtherPlayer(players, plr.id).id;

  const { moveType } = move;

  if (moveType === MoveTypes.InitializeBoard) {
    const { playerBoard } = move;
    board[plr.id] = playerBoard;
    state.playersReady += 1;

    if (state.playersReady === players.length) {
      state.status = Status.InGame;
    }
  } else if (moveType === MoveTypes.Attack) {
    const sinkShip = (x, y, opponentCell) => {
      if (
        x >= 0
        && x < board[plr.id].length
         && y >= 0
         && y < board[plr.id][x].length
          && board[otherPlrID][x][y] === opponentCell
          && attackBoard[plr.id][x][y] !== AttackTypes.Sunk
      ) {
        attackBoard[plr.id][x][y] = AttackTypes.Sunk;

        sinkShip(x - 1, y, opponentCell);
        sinkShip(x + 1, y, opponentCell);
        sinkShip(x, y - 1, opponentCell);
        sinkShip(x, y + 1, opponentCell);
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

      if (hitCounts[plr.id][opponentCell] === ships[opponentCell]) {
        sinkShip(x, y, opponentCell);
      } else {
        attackBoard[plr.id][x][y] = AttackTypes.Hit;
      }
    } else {
      attackBoard[plr.id][x][y] = AttackTypes.Miss;
    }
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
    return { state, joinable: false, finished: true };
  }
  return { joinable: false, finished: true };
}

module.exports = {
  onRoomStart,
  onPlayerJoin,
  onPlayerMove,
  onPlayerQuit,
};
