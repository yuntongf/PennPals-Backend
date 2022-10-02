const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
var bodyParser = require('body-parser');
const app = express();
const auth = require("./middleware/auth")
const {Message} = require("./models/message");
const {User} = require("./models/user");
var jsonParser = bodyParser.json();
require("./setup/cors")(app);
require("./setup/db")();

app.get("/", jsonParser, async (req, res) => {
  const messages = await Message.find();
  res.send(messages);
});

app.post("/Register", jsonParser, async (req, res) => {
  let user = await User.findOne({username:req.body.username});
  if (user) return res.status(400).send("Username already exists")
  user = new User({
    username : req.body.username,
    password : req.body.password,
    liked : []
  });
  await user.save();
  const token = jwt.sign({_id:user._id, username:user.username, liked:user.liked}, "jwtPrivateKey");
  res
  .header('x-token', token)
  .header("access-control-expose-headers", "x-token")
  .send(user);
})

app.post("/Login", jsonParser, async (req, res) => {
  let user = await User.findOne({username:req.body.username});
  if (!user) return res.status(400).send("Invalid username or password.")
  if (user.password !== req.body.password) return res.status(400).send("Invalid username or password.")
  
  const token = jwt.sign({_id:user._id, username:user.username, liked:user.liked}, "jwtPrivateKey");
  res.send(token);
})

app.get("/MessageBoard", jsonParser, async (req, res) => {
  const messages = await Message.find();
  res.send(messages);
});

app.post("/MessageBoard/Compose",  jsonParser, async (req, res) => {
  const message = new Message({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    likes: 0,
    reported: 0,
    deleted: false,
    replies: req.body.replies,
    date: req.body.date
  });

  const messageback = await message.save();
  res.send(messageback);
});

app.get("/MessageBoard/Message/:id",  jsonParser, async (req, res) => {
  const id = req.params['id']
  const message = await Message.findById(id);
  res.send(message);
});

app.put("/MessageBoard/Message/:id", jsonParser, async (req, res) => {
  let messages = await Message.findByIdAndUpdate(
    req.params['id'],
    { 
      title: req.body.title,
      likes: req.body.likes,
      author: req.body.author,
      content: req.body.content,
      edited: req.body.edited,
      reported: req.body.reported,
      replies: req.body.replies,
      })
  const user = await User.findByIdAndUpdate(
    req.body.user._id, 
    {
      username:req.body.user.username,
      username:req.body.user.password,
      liked: req.body.user.liked
    }
    );
  const token = jwt.sign({_id:user._id, username:user.username, liked:req.body.user.liked}, "jwtPrivateKey");
  res.send({messages, token});
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
