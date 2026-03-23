const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
    set: (v) => v.trim().replace(/\s+/g, " "),
  },
  gmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
     minLength: 4,
  },
});

const game = mongoose.model("game", UserSchema);

module.exports = game;
