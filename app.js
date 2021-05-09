if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log(process.env.SECRET);
const express = require("express");
const app = express();
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Joi = require("joi");
const session = require("express-session");
const catchAsync = require("./utils/catchAsync");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Review = require("./models/review");
const path = require("path");
const Campground = require("./models/campground");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const User = require("./models/user");
const userRoutes = require("./routes/users");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My backyard",
    description: "chip climbing",
  });
  await camp.save();
  res.send(camp);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "oh no..something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("servering on port 3000");
});
