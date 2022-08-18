const { Message } = require("./models/message");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    author: "A",
    title: "A's title",
    content: "A's content",
  },
  {
    author: "B",
    title: "B's title",
    content: "B's content",
  },
  {
    author: "C",
    title: "C's title",
    content: "C's content",
  },
  {
    author: "D",
    title: "D's title",
    content: "D's content",
  },
  {
    author: "E",
    title: "E's title",
    content: "E's content",
  }
];

async function seed() {
  await mongoose.connect(config.get("db"));

  await Message.deleteMany({});

  await Message.insertMany(data);

  /*
  for (let author of data) {
    const { _id: genreId } = await new Message({ name: genre.name }).save();
    const movies = genre.movies.map(movie => ({
      ...movie,
      genre: { _id: genreId, name: genre.name }
    }));
    await Movie.insertMany(movies);
  }*/

  mongoose.disconnect();

  console.info("Done!");
}

seed();
