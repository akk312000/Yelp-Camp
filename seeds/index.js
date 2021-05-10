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
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "609637e63d85bf27b4ca0a98",
      ///my user id
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      // image: "https://source.unsplash.com/collection/11710947",
      description: "lorem ipsum",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url:
            "https://res.cloudinary.com/dygtye4t1/image/upload/v1620665087/YelpCamp/h2ew9esk6j9wvf9tqtag.jpg",
          filename: "YelpCamp/zsrc6ynxf1lvahfsvrnv",
        },
        {
          url:
            "https://res.cloudinary.com/dygtye4t1/image/upload/v1620665085/YelpCamp/lm87nfsuwjxpkszbptij.jpg",
          filename: "YelpCamp/zirwchnbk7ep8691tq0l",
        },
        {
          url:
            "https://res.cloudinary.com/dygtye4t1/image/upload/v1620665040/YelpCamp/hrym5wlimt7sjqnyrskb.jpg",
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
