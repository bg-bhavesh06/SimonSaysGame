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
    minlength: [4, "Password must be at least 4 characters long"],
  },
});

const game = mongoose.model("game", UserSchema);

module.exports = game;
