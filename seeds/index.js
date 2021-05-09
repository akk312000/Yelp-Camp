const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const path = require("path");
const Campground = require("../models/campground");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "609637e63d85bf27b4ca0a98",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      // image: "https://source.unsplash.com/collection/11710947",
      description: "lorem ipsum",
      price: price,
      images: [
        {
          url:
            "https://res.cloudinary.com/dygtye4t1/image/upload/v1620576383/YelpCamp/zsrc6ynxf1lvahfsvrnv.png",
          filename: "YelpCamp/zsrc6ynxf1lvahfsvrnv",
        },
        {
          url:
            "https://res.cloudinary.com/dygtye4t1/image/upload/v1620576384/YelpCamp/zirwchnbk7ep8691tq0l.png",
          filename: "YelpCamp/zirwchnbk7ep8691tq0l",
        },
        {
          url:
            "https://res.cloudinary.com/dygtye4t1/image/upload/v1620576385/YelpCamp/kndiwpfbxpqgfjwm4dvh.png",
          filename: "YelpCamp/kndiwpfbxpqgfjwm4dvh",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
