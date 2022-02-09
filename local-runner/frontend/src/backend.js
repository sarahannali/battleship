/* eslint-disable */
// TicTacToe Example

function getPlrToMove(board, plrs){
  let xCount = 0;
  let oCount = 0;
  for(const row of board){
    for(const mark of row){
      if (mark === 'X'){
        xCount++;
      }else if(mark === 'O'){
        oCount++;
      }
    }
  }
  if(xCount === oCount){
    return plrs[0]
  }else{
    return plrs[1]
  }
}

function getPlrMark(plr, plrs){
  if(plr === plrs[0]){
    return 'X'
  }else{
    return 'O'
  }
}

function getPlrFromMark(mark, plrs){
  return mark === 'X' ? plrs[0] : plrs[1]
}

function isWinningSequence(arr){
  return arr[0] != null && arr[0] == arr[1] && arr[1] == arr[2]
}

function isEndGame(board, plrs){
  // check if there is a winner
  for(let i = 0; i < board.length; i++){
    const row = board[i]
    const col = [board[0][i], board[1][i], board[2][i]]
    
    if(isWinningSequence(row)){
      return [true, getPlrFromMark(row[0], plrs)]
    }else if(isWinningSequence(col)){
      return [true, getPlrFromMark(col[0], plrs)]
    }
  }

  const d1 = [board[0][0], board[1][1], board[2][2]]
  const d2 = [board[0][2], board[1][1], board[2][0]]
  if(isWinningSequence(d1)){
    return [true, getPlrFromMark(d1[0], plrs)]
  }else if(isWinningSequence(d2)){
    return [true, getPlrFromMark(d2[0], plrs)]
  }

  // check for tie
  if(board.some((row)=>{
    return row.some(mark => mark === null)
  })){
    return [false, null]
  }else{
    return [true, null]
  }
}

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
 function onRoomStart(){
  return {
    state: {
      state: "NOT_STARTED", // NOT_STARTED, IN_GAME
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      winner: null, // null means tie if game is finished, otherwise set to the plr that won
    },
  }
}

/**
 * onPlayerJoin
 * @param {string} plr string, which represents the player id
 * @param {BoardGame} currentGame
 * @returns {BoardGameResult}
 */
function onPlayerJoin(plr, {players, state}){
  // VALIDATIONS
  // check if game has started
  if(state.state !== "NOT_STARTED"){
    throw new Error("game has already started, can't join the game!")
  }

  // TRANSFORMATIONS
  // determine if we should start the game
  if (players.length === 2){
    // start game
    state.state = "IN_GAME"
    return {
      state,
      joinable: false
    }
  } else {
    return {
      state,
      joinable: true
    }
  }
}

/**
 * onPlayerMove
 * @param {string} plr string, which represents the player id
 * @param {*} move json object, controlled the creator that represents the player's move
 * @param {BoardGame} currentGame
 * @returns {BoardGameResult}
 */
function onPlayerMove(plr, move, { state, players, joinable }){
  const {board} = state
  console.log("PLR: ", plr)
  console.log("PLAYER TO MOVE: ", getPlrToMove(board, players))
  console.log("STATE: ", state)
  console.log("PLAYERS: ", players);

  // VALIDATIONS
  // boardgame must be in the game
  const {x, y} = move

  if(state.state !== "IN_GAME"){
    throw new Error("game is not in progress, can't make move!")
  }
  if(getPlrToMove(board, players) !== plr){
    throw new Error("Its not this player's turn: " + plr)
  }
  if(board[x][y] !== null){
    throw new Error("Invalid move, someone already marked here: " + x + "," + y)
  }
  
  const plrMark = getPlrMark(plr, players)
  
  board[x][y] = plrMark

  // Check if game is over
  const [isEnd, winner] = isEndGame(board, players)
  if(isEnd){
    state.winner = winner
    return {state, finished: true}
  }
  return { state }
}

/**
 * onPlayerQuit
 * @param {string} plr string, which represents the player id
 * @param {BoardGame} currentGame
 * @returns {BoardGameResult}
 */
function onPlayerQuit(plr, {state, players}){
  if (players.length === 1) {
    state.winner = players.filter(playerId => playerId !== plr)[0]
    return {state, joinable: false, finished: true}
  } else {
    return {joinable: false, finished: true}
  }
}

module.exports = {
  onRoomStart,
  onPlayerJoin,
  onPlayerMove,
  onPlayerQuit,
}