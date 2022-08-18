const mongoose = require("mongoose");

const Reply= mongoose.model(
  "Reply",
  new mongoose.Schema({
    author: {
      type: String,
      trim:true
    },
    content: {
      type: String
    },
    likes : {
      type: Number,
      default:0
    },
    edited : {
      type : Boolean,
      default : false
    },
    reported : {
      type : Number,
      default : 0
    }
  })
);

exports.Reply = Reply;


