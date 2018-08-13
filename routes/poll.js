require("dotenv/config");
const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");
const Pusher = require("pusher");

// import dotenv from "dotenv";
// import express from "express";
// import Vote from "../models/Vote";
// import Pusher from "Pusher";
// const router = express.Router();

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "us2",
    encrypted: true
});

router.get("/", (req, res) => {
    Vote.find().then(votes => res.json({ success: true, votes: votes }));
});

router.post("/", (req, res) => {
    const newVote = {
        os: req.body.os,
        points: 1
    };

    new Vote(newVote).save().then(vote => {
        pusher.trigger("judgeathon", "judge", {
            points: parseInt(vote.points),
            os: vote.os
        });

        return res.json({
            success: true,
            message: "Thanks for your vote"
        });
    });
});

module.exports = router;
