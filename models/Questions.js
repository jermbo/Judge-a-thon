const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionsSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    HackathonId: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    RangeStart: {
        type: Number,
        required: true
    },
    RangeEnd: {
        type: Number,
        required: true
    },
    Answers: [String]

});

// create collection and add schema
const Questions = mongoose.model("Questions", QuestionsSchema,"Questions");

module.exports = Questions;

// Questions - hackathonid,Question Title, Question Description,Score range, possible array of answers (with order already from best to worse)
//  db.collection('Questions').insert({HackathonID:11111,Title:'Impact',Description:`The Team is clear about the problem being solved.<BR/>The solution can affect a large number of people.<BR/>The solution will make a big improvement in people's lives.`,RangeStart:1,RangeEnd:5,AnswersArray:[]})
