const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JudgeSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    HackathonId: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }

});

// create collection and add schema
const Judges = mongoose.model("Judges", JudgeSchema);

module.exports = Judges;


// Judges - hackathonid, Name, login, password?
//  db.collection('Judges').insertOne({HackathonID:11111,Name: 'Rick',Description: 'IBM Guy',Username:'rick',Password:'rick123'}) 