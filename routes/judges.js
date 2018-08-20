const express = require("express");
const path = require("path");
const router = express.Router();
const Judges = require("../models/Judges");
const Questions = require("../models/Questions");
const Teams = require("../models/Teams");

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/judges.html"));
});

router.post("/auth", (req, res) => {
    let username = req.body.Username;
    let password = req.body.Password;

    if (!username && !password) {
        res.json({ login: false, error: "Username or password are required" });
        return;
    }

    Judges.find({ Username: username, Password: password }, (err, Judge) => {
        console.dir(Judge);
        if (err) {
            console.err(err);
        }
        if (Judge != undefined && Judge.length > 0) {
            //login successful
            console.dir(Judge);
            res.json({
                login: true,
                id: Judge[0]._id,
                Name: Judge[0].Name,
                HackathonId: Judge[0].HackathonId,
            });
        } else {
            //user not found
            res.json({
                login: false,
                error: "Username or password is incorrect"
            });
        }
    });
}); // end of /auth;

router.post("/questions", (req, res) => {
    let HackathonId = req.body.HackathonId;
    console.log("looking for questions with hackathon: " + HackathonId);
    Questions.find({ HackathonId: HackathonId }, (err, Questions) => {
        res.json(Questions);
    });
});

router.post("/teams", (req, res) => {
    let HackathonId = req.body.HackathonId;
    console.log("looking for teams with hackathon: " + HackathonId);
    Teams.find({ HackathonId: HackathonId })
        .sort({ TotalScore: -1 })
        .then(Teams => {
            res.json(Teams);
        });
});

router.post("/vote", (req, res) => {
    console.log("Votes")
    let vote = req.body;
    console.log("Votes",vote)
    try {
        let JudgeId = vote.JudgeId;
        let TeamId = vote.TeamId;
        let QuestionAnswers = vote.Questions;
        let NoOfJudges = Judges.count({});
        let TotalScoreFromThisJudge = 0;
        QuestionAnswers.map(q => {
            TotalScoreFromThisJudge += q.Score;
        });
        let Notes = vote.Notes;
        let Judgment = {
            JudgeId: JudgeId,
            Questions: QuestionAnswers,
            Notes: Notes
        };
        // Remove our own judgment
        let noOfJugments = 0;
        Teams.findById(TeamId, (err, team) => {
            if (team.Judgments) {
                // We have at least ONE judgement
                team.Judgments = team.Judgments.filter(j => {
                    return j.JudgeId != JudgeId;
                }); // filter out our own Judgment
                noOfJugments = team.Judgments.length;
            }
        });
        Teams.save((err, updatedTeam) => {
            // Save if anything changed so we can add our new one.
            // Add our own judgement
            Teams.update(
                { _id: TeamId },
                { $addToSet: { Judgments: Judgment } }
            ).then(() => {
                res.json({ Success: true });
                noOfJugments++;
                console.log("Number of Judgments:",noOfJugments);
                console.log("Number of Judges:",NoOfJudges);

                // Let's see if all the judges have added judgments. If so. Let's order these suckers.
                if (noOfJugments == NoOfJudges) {
                    // All judges have placed their judgements for this team.

                    // did all the judges vote on ALL the teams?
                    // Since I can just count to see if all the other teams have votes we can
                    // assume here that if we're here everyone voted for all the teams

                    let HaveAllTeamsBeenJudged = true;

                    Teams.find({ HackathonId: HackathonId }).then(teams => {
                        let TeamsLeftToJudge = teams.filter(t => {
                            return t.Judgments.length != NoOfJudges;
                        });
                        console.log("We have these many teams left to be judged by this judge:"+ TeamsLeftToJudge);

                        if (TeamsLeftToJudge == 0) {
                            // Let's declare a winner
                            Teams.find({ HackathonId: HackathonId })
                                .sort({ TotalScore: -1 })
                                .then(teams => {
                                    let counter = 1;
                                    teams.map(t => {
                                        t.RankText = PrettyRankText(counter);
                                        counter++;
                                    });
                                });
                        }
                    });
                }
            });
        });
    } catch (ex) {
        console.error(ex);
        res.json({ Success: false, Error: ex });
    }
});

let PrettyRankText = num => {
    let numToText = " " + num;
    switch (numToText.substr(numToText.length - 1)) {
        case "1":
            return "" + num + "st";
            break;
        case "2":
            return "" + num + "nd";
            break;
        case "3":
            return "" + num + "rd";
            break;
        default:
            return "" + num + "th";
    }
};

// Team - hackathonid,Name, description, people involved, Judgments Array [ Judgeid, questionID, Score or answer from array, Note from judge, *Judge suggested Rank*], Rank Text (“1st” , “2nd”, “Best use of flowers”), Order (kind of rank but so they can drag around ones to the top and bottom
// db.collection('Teams').insert({HackathonID:11111,Name:'Team A',Description:'Team Description',PeopleInvolved:'name1,name2',Judgments:[],RankText:'',order:-1);
// Judgements to add to teams:
// let Judgment = {JudgeId:'1234', questions: [{questionId:'1234', Score:5}], Note:'Note from judge'];
// db.collection('Teams').update({_id:ObjectId('teamidhere')}, {$addToSet:{Judgments:Judgment}});,{w:1,upsert:1,multi:1});
// Update Rank
// db.collection('Teams').update({_id:ObjectId('teamidhere')}, {$set:{RankText:'1st',order:1}});,{w:1});

module.exports = router;
