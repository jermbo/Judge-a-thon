const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const poll = require("./routes/poll");
const judges = require("./routes/judges");

require("./config/db");


// setting up the system.
// FOR NOW, let's add the Hackathons and Judges and Questions: MANUALLY
// Hackathon info
//  db.collection('Hackathons').insertOne({Name:'Palm Beach Tech Oct Office Depot Hackathon'});
// Judges - hackathonid, Name, login, password?
//  db.collection('Judges').insertOne({HackathonID:11111,Name: 'Rick',Description: 'IBM Guy',Username:'rick',Password:'rick123'}) 
// Questions - hackathonid,Question Title, Question Description,Score range, possible array of answers (with order already from best to worse)
//  db.collection('Questions').insert({HackathonID:11111,Title:'Impact',Description:`The Team is clear about the problem being solved.<BR/>The solution can affect a large number of people.<BR/>The solution will make a big improvement in people's lives.`,RangeStart:1,RangeEnd:5,AnswersArray:[]})
// Team - hackathonid,Name, description, people involved, Judgments Array [ Judgeid, questionID, Score or answer from array, Note from judge, *Judge suggested Rank*], Rank Text (“1st” , “2nd”, “Best use of flowers”), Order (kind of rank but so they can drag around ones to the top and bottom
// db.collection('Teams').insert({HackathonID:11111,Name:'Team A',Description:'Team Description',PeopleInvolved:'name1,name2',Judgments:[],RankText:'',order:-1);
// Judgements to add to teams: 
// let Judgment = {JudgeId:'1234', questions: [{questionId:'1234', Score:5}], Note:'Note from judge'];
// db.collection('Teams').update({_id:ObjectId('teamidhere')}, {$addToSet:{Judgments:Judgment}});,{w:1,upsert:1,multi:1});    
// Update Rank
// db.collection('Teams').update({_id:ObjectId('teamidhere')}, {$set:{RankText:'1st',order:1}});,{w:1});   


const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/poll", poll);
app.use("/judges", judges);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
