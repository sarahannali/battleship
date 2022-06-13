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

const Ships = Object.freeze({
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
});

module.exports = {
  Status,
  MoveTypes,
  AttackTypes,
  Ships,
};
