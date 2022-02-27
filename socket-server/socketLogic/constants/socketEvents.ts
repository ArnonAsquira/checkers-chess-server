const incomingSocketEvents = {
  joinGame: "join game",
  selectPiece: "select piece",
  takeTurn: "take turn",
};

const outGoingSocketEvents = {
  joinedGame: "joined game",
  playerDisconnected: "player disconnected",
  indicators: "indicators",
  error: "err",
};

export { incomingSocketEvents, outGoingSocketEvents };
