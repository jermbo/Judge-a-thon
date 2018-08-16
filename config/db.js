const mongoose = require("mongoose");

// map global promises
mongoose.Promise = global.Promise;

// connect mongo
mongoose
    .connect(
        "mongodb://localhost:27017/judgeathon",
        { useNewUrlParser: true }
    )
    .then(() => {
        console.log("mongo connected");
    })
    .catch(err => {
        console.error(err);
    });
