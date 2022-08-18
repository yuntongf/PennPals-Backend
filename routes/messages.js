const { Message } = require("../models/message");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const message = new Message({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    likes:0,
    reported:req.body.reported
  });
  await message.save();
  res.send(message);
});

module.exports = router;
