const mongoose = require("mongoose");

// map global promises
mongoose.Promise = global.Promise;

// connect mongo
mongoose
    .connect(
        "mongodb://judger:judger1@ds221292.mlab.com:21292/judgeathon",
        { useNewUrlParser: true }
    )
    .then(() => {
        console.log("mongo connected");
    })
    .catch(err => {
        console.error(err);
    });
