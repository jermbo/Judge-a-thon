require("dotenv/config");
const express = require("express");
const router = express.Router();
const Judges = require("../models/Judges");
const Questions = require("../models/Questions");
const Teams = require("../models/Teams");

router.post("/auth",(req,res) => {
    let username = req.body.Username;
    let password = req.body.Password;
    if ( (username) && (password) ) {
        Judges.find({Username:username,Password:password,deleted:{$ne:true}} ).then(Judge => {
                    if (Judge != undefined) {
                        //login successful
                        res.json({login:true,id:Judge._id,Name:Judge.Name});
                    } else {
                        //user not found
                        res.json({login:false,error:'Username or password is incorrect'});
                    }
             })
    } else {
        res.json({login:false,error:'Username or password are required'});
    }
}); // end of /auth;

router.post("/Questions",(req,res) => {
    Questions.find().then(Questions => {
        res.json(Questions);
    });
});

router.post("/Vote",(req,res) => {
    let vote = req.body;
    try {
        let JudgeId = vote.JudgeId;
        let TeamId = vote.TeamId;
        let QuestionAnswers = vote.Questions;
        let TotalScoreFromThisJudge = 0;
        QuestionAnswers.map((q)=> { TotalScoreFromThisJudge += q.Score;})
        let Notes = vote.Notes
        let Judgment = {JudgeId:JudgeId, Questions: QuestionAnswers, Notes:Notes};
        // Remove our own judgment
        let noOfJugments = 0
        Teams.findById(TeamId,(err,team) => {
            
            if (team.Judgments) {
                // We have at least ONE judgement
                team.Judgments = team.Judgments.filter((j)=> { return j.JudgeId != JudgeId}) // filter out our own Judgment
                noOfJugments = team.Judgments.length;
            }
        });    
        // Add our own judgement
        Teams.update({_id:TeamId},{$addToSet:{Judgments:Judgment}}).then(() =>{
            res.json({Success:true});
        })
        
        // Let's see if all the judges have added judgments. If so. Let's order these suckers.
        if (noOfJugments == Judges.count({})) {
            // All judges have placed their 
            Teams.find().sort({TotalScore:-1}).then((teams) => {
                
                let counter = 1;
                teams.map((t)=> {
                    t.RankText = PrettyRankText(counter);
                    counter++;
                })
            });
        }


let PrettyRankText = (num) => {
    let numToText = " "+num;
    switch(numToText.substr(numToText.length-1)) {
        case "1": return "" + num + "st"; break;
        case "2": return "" + num + "nd"; break;
        case "3": return "" + num + "rd"; break;
        default : return "" + num + "th"; 
    }
}

// Team - hackathonid,Name, description, people involved, Judgments Array [ Judgeid, questionID, Score or answer from array, Note from judge, *Judge suggested Rank*], Rank Text (“1st” , “2nd”, “Best use of flowers”), Order (kind of rank but so they can drag around ones to the top and bottom
// db.collection('Teams').insert({HackathonID:11111,Name:'Team A',Description:'Team Description',PeopleInvolved:'name1,name2',Judgments:[],RankText:'',order:-1);
// Judgements to add to teams: 
// let Judgment = {JudgeId:'1234', questions: [{questionId:'1234', Score:5}], Note:'Note from judge'];
// db.collection('Teams').update({_id:ObjectId('teamidhere')}, {$addToSet:{Judgments:Judgment}});,{w:1,upsert:1,multi:1});    
// Update Rank
// db.collection('Teams').update({_id:ObjectId('teamidhere')}, {$set:{RankText:'1st',order:1}});,{w:1});   


    } catch (ex) {
        res.json({Success:false,Error:ex});
    }
});

module.exports = router;