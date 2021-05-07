const { GameRoomModel /* , GAMEROOM_STATE */ } = require('../models/GameRoom.js');

// Returns slice of rooms in server
const rooms = (req, res) => GameRoomModel.find({})
  .then((doc) => res.json(doc))
  .catch(() => res.status(500).json({ error: 'An error ocurred retrieving the rooms' }));


// Returns room specified in QUERY ID
// Returns room in session if no ID specified in QUERY
const room = (req, res) => {
  if (!req.query.id && !req.session.room) {
    return res.status(400).json({
      error: 'Room ID is undefined in query string and room is undefined in request session',
    });
  }

  // Search by ID
  if (req.query.id) {
    return GameRoomModel.findOneByID(req.query.id)
      .then((doc) => res.json(doc))
      .catch((err) => res.status(err.statusCode).json({ error: err.message }));
  }

  // Return room in session
  return GameRoomModel.findOneByID(req.session.room._id)
    .then((doc) => {
      // Update room in session
      req.session.room = doc;
      // Return it
      return res.json(doc);
    })
    .catch((err) => res.status(err.statusCode).json({ error: err.message }));
};

// Returns board of room in session
const board = (req, res) => {
  if (!req.session.room) {
    return res.status(400).json({ error: 'Room is undefined in request session' });
  }

  return res.json(req.session.room.board);
};

const join = (req, res) => {
  // Check that all parameters are sent in request
  if (!req.body.id) {
    return res.status(400).json({ error: 'Room ID is undefined in request body' });
  }

  // Join room
  return GameRoomModel.join(req.body.id, req.session.account.username)
    .then((doc) => {
      req.session.room = doc;
      return res.json(doc);
    })
    .catch((err) => res.status(err.statusCode).json({ error: err.message }));
};

const rejoin = (req, res) => {
  // Check that all parameters are sent in request
  if (!req.body.id) {
    return res.status(400).json({ error: 'Room ID is undefined in request body' });
  }

  // Rejoin room
  return GameRoomModel.findOneByID(req.body.id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ error: 'No room found with the ID specified' });
      }

      req.session.room = doc;
      return res.json(doc);
    })
    .catch((err) => res.status(err.statusCode).json({ error: err.message }));
};

const create = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Room name is undefined in request body' });
  }

  // Create & join room
  return GameRoomModel.createOne(req.body.name, req.session.account.username)
    .then((createdDoc) => GameRoomModel.join(createdDoc._id, req.session.account.username)
      .then((joinedDoc) => {
        req.session.room = joinedDoc;
        return res.json(joinedDoc);
      })
      .catch((err) => res.status(err.statusCode).json({ error: err.message })))
    .catch((err) => res.status(err.statusCode).json({ error: err.message }));
};

const leave = (req, res) => {
  if (!req.session.room) {
    return res.status(400).json({ error: 'Room is undefined in request session' });
  }

  const id = req.session.room._id;
  const username = req.session.account.username;

  return GameRoomModel.leave(id, username)
    .then((doc) => {
      req.session.room = null;
      return res.json(doc);
    })
    .catch((err) => res.status(err.statusCode).json({ error: err.message }));
};


const turn = (req, res) => {
  // Board indexes
  // 0|1|2
  // -----
  // 3|4|5
  // -----
  // 6|7|8

  if (!req.body.utttCell) {
    return res.status(400).json({ error: 'utttCell is undefined in request body' });
  }

  if (!req.body.tttCell) {
    return res.status(400).json({ error: 'tttCell is undefined in request body' });
  }

  if (!req.session.room) {
    return res.status(400).json({ error: 'Room is undefined in request session' });
  }

  return GameRoomModel.turn(req.session.room._id, req.session.account.username,
    [
      req.body.utttCell,
      req.body.tttCell,
    ])
    .then((doc) => {
      req.session.room = doc;
      return res.json(doc);
    })
    .catch((err) => res.status(err.statusCode).json({ error: err.message }));
};

const surrender = (req, res) => {
  if (!req.session.room) {
    return res.status(400).json({ error: 'Room is undefined in request session' });
  }

  return GameRoomModel.surrender(req.session.room._id, req.session.account.username)
    .then((doc) => {
      req.session.room = doc;
      return res.json(doc);
    })
    .catch((err) => res.status(err.statusCode).json({ error: err.message }));
};

const deleteRoom = (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ error: 'Room ID is undefined in request query string' });
  }

  return GameRoomModel.deleteOneByID(req.query.id).catch((err) => {
    console.log(err);
  }).then((doc) => res.json(doc));
};

module.exports = {
  rooms,
  room,
  board,
  join,
  rejoin,
  create,
  leave,
  turn,
  surrender,
  deleteRoom,
};
