const mongoose = require("mongoose");

const userSchema = 
  new mongoose.Schema({
    username: {
      type: String,
      trim:true
    },
    password: {
      type: String
    },
    liked:  {
      type: [String],
      default: []
    }
  });

const User = mongoose.model('User', userSchema);
exports.User = User;
exports.userSchema = userSchema;
