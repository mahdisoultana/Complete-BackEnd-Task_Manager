const express = require("express");
///MongoDB Setup with Mongoose
require("./db/mongoose");

// Read This for Router Express : https://expressjs.com/fr/4x/api.html#router.param
const userRouter = require("./routers/users");
const userTask = require("./routers/tasks");
//Express Setup Read Doc https://expressjs.com/fr/4x/api.html
const app = express();
const port = process.env.PORT;

// const multer = require("multer");
// const destination = multer({ dest: "images" });

// app.post("/upload", destination.single("upload"), (req, res) => {
//   res.send();
// });

// app.use((req, res, next) => {
//   switch (req.method) {
//     case "GET":
//       res.status(503).send("Sorry The Site Under Maintance");
//       break;
//     case "PUT":
//       next();
//       break;
//     case "POST":
//       res.status(503).send("Sorry The Site Under Maintance");
//       break;
//     case "DELETE":
//       res.status(503).send("Sorry The Site Under Maintance");
//       break;
//     default:
//       res.status(503).send("Sorry The Site Under Maintance");
//   }
// });
app.use(express.json());

app.use(userRouter);
app.use(userTask);
app.get("/", (req, res) => {
  res.send("If You see this Message Then your Backend It Fire !! ");
});
////Listen to The Port
app.listen(port, () => {
  console.log("Server Is Running in Port :" + port);
});
