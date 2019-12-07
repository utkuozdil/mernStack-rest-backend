const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const uuidv4 = require("uuid/v4");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");

const { getMongoDB_URI } = require("./util/mongoDB");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

const diskStorage = multer.diskStorage({
  destination: function(request, file, callback) {
    callback(null, "images");
  },
  filename: function(request, file, callback) {
    callback(null, uuidv4());
  }
});

const fileFilter = (request, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    callback(null, true);
  else callback(null, false);
};

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(
  multer({ storage: diskStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  response.status(statusCode).json({ message, data });
});

mongoose
  .connect(getMongoDB_URI(), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => app.listen(process.env.NODEJS_PORT))
  .catch(error => console.log(error));
