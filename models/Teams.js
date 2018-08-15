const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
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
    PeopleInvolved: {
        type: String,
        required: true
    },
    Judgments: [],
    TotalScore: {
        type: Number,
        required: true,
        default:0
    },
    RankText: {
        type: String,
        required: true
    },
    Order: {
        type: Number,
        required: true,
        default:-1
    },
});

// create collection and add schema
const Teams = mongoose.model("Teams", TeamSchema);

module.exports = Teams;

// Team - hackathonid,Name, description, people involved, Judgments Array [ Judgeid, questionID, Score or answer from array, Note from judge, *Judge suggested Rank*], Rank Text (“1st” , “2nd”, “Best use of flowers”), Order (kind of rank but so they can drag around ones to the top and bottom
// db.collection('Teams').insert({HackathonID:11111,Name:'Team A',Description:'Team Description',PeopleInvolved:'name1,name2',Judgments:[],RankText:'',order:-1);
// Judgements to add to teams: 
// let Judgment = {JudgeId:'1234', questions: [{questionId:'1234', Score:5}], Note:'Note from judge'];
// db.collection('Teams').update({_id:ObjectId('teamidhere')}, {$addToSet:{Judgments:Judgment}});,{w:1,upsert:1,multi:1});    
// Update Rank
// db.collection('Teams').update({_id:ObjectId('teamidhere')}, {$set:{RankText:'1st',order:1}});,{w:1});   
