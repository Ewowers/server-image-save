const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const api = require("./route/api"); // роутер апи
const app = express();
app.use(express.json()); // ajax json
app.use(cookieParser()); // куки
app.use("/api", api); // мидлвейр апи
const start = async () => {
  try {
    const url = "mongodb://localhost:27017/TestShop"; // подключение к бд
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log("run " + port);
    });
  } catch (err) {
    console.error;
  }
};
start();
