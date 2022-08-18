//const winston = require("winston");
const express = require("express");
const config = require("config");
var bodyParser = require('body-parser');
const app = express();
const {Message} = require("./models/message");
const {Reply} = require("./models/reply")
const mongoose = require("mongoose");
const cors = require('cors');
app.use(cors());
var jsonParser = bodyParser.json();


app.post("/", jsonParser, async (req, res) => {
  //console.log(req.body);
  const message = new Message({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    likes: 0,
    reported: false
  });
  const messageback = await message.save();
  console.log(messageback);
  res.send(messageback);
});

app.post("/MessageBoard/Replies", jsonParser, async (req, res) => {
  //console.log(req.body);
  const reply = new Reply({
    author: req.body.author,
    content: req.body.content,
    likes: 0,
    reported: false
  });
  const replyback = await reply.save();
  console.log(replyback);
  res.send(replyback);
});

app.get("/", jsonParser, async (req, res) => {
  const messages = await Message.find();
  res.send(messages);
});

app.get("/MessageBoard/Replies", jsonParser, async (req, res) => {
  const replies = await Reply.find();
  res.send(replies);
});

app.get("/MessageBoard", jsonParser, async (req, res) => {
  const messages = await Message.find();
  res.send(messages);
});

app.put("/MessageBoard/Message/:id", jsonParser, async (req, res) => {
  const messages = await Message.findByIdAndUpdate(
    req.params['id'],
    { 
      title: req.body.title,
      likes: req.body.likes,
      author: req.body.author,
      content: req.body.content,
      edited: req.body.edited,
      reported: req.body.reported
      })
  res.send(messages);
});

app.delete("/MessageBoard/Message/:id", jsonParser, async (req, res) => {
  const message = await Message.findByIdAndRemove(req.params['id']);

  if (!message)
    return res.status(404).send("The message with the given ID was not found.");

  res.send(message);
});



//require("./startup/logging")();
//require("./startup/cors")(app);
//require("./startup/routes")(app);
require("./startup/db")();
//require("./startup/config")();

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
