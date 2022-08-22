const express = require("express");
const config = require("config");
var bodyParser = require('body-parser');
const app = express();
const {Message} = require("./models/message");
var jsonParser = bodyParser.json();
require("./setup/cors")(app);
require("./setup/db")();

app.get("/", jsonParser, async (req, res) => {
  const messages = await Message.find();
  res.send(messages);
});

app.get("/MessageBoard", jsonParser, async (req, res) => {
  const messages = await Message.find();
  res.send(messages);
});

app.post("/MessageBoard/Compose", jsonParser, async (req, res) => {
  console.log(req.body);
  const message = new Message({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    likes: 0,
    reported: 0,
    deleted: false,
    replies: req.body.replies
  });
  const messageback = await message.save();
  console.log(messageback);
  res.send(messageback);
});

app.put("/MessageBoard/Message/:id", jsonParser, async (req, res) => {
  console.log(req.body.replies);
  let messages = await Message.findByIdAndUpdate(
    req.params['id'],
    { 
      title: req.body.title,
      likes: req.body.likes,
      author: req.body.author,
      content: req.body.content,
      edited: req.body.edited,
      reported: req.body.reported,
      replies: req.body.replies
      })
  res.send(messages);
});

app.delete("/MessageBoard/Message/:id", jsonParser, async (req, res) => {
  const message = await Message.findByIdAndRemove(req.params['id']);
  if (!message)
    return res.status(404).send("The message with the given ID was not found.");
  res.send(message);
});

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
