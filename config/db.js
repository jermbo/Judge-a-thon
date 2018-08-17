const mongoose = require("mongoose");

// map global promises
mongoose.Promise = global.Promise;

const dbUser = process.env.DB_USER;
const dbPwd = process.env.DB_PWD;
const mongoDB = process.env.ENV =='DEV' ? `mongodb://localhost:21027/judgeathon` : `mongodb://${dbUser}:${dbPwd}@ds221292.mlab.com:21292/judgeathon`;

console.log(process.env.ENV);

// connect mongo
mongoose
    .connect(
        mongoDB,
        { useNewUrlParser: true }
    )
    .then(() => {
        console.log("mongo connected");
    })
    .catch(err => {
        console.error(err);
    });
