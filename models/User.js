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
    set: (v) => v.trim().toLowerCase(),
  },

  mobile: {
    type: String,
    required: true,
    unique: true,

    match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    set: (v) => String(v).trim(),
  },

  password: {
    type: String,
    required: true,
    minlength: [4, "Password least 4 characters long"],
  },
});

const user = mongoose.model("User", UserSchema);

module.exports = user;
