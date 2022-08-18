const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    author: {
      type: String,
      trim:true
    },
    title: {
      type: String
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

exports.Message = Message;


