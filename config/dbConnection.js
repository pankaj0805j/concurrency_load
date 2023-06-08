let mongoose = require("mongoose");

const connect = async function () {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mongo_tes1", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connection Established!");
  } catch (error) {
    console.log(error)
    console.error("\x1b[31m", "Unable to connect to database", "\x1b[0m");
  }
};

connect();