const express = require("express");
const router = express.Router();

const Pusher = require("pusher");

var pusher = new Pusher({
    appId: "574940",
    key: "c8fd2a38c6a9b084ccde",
    secret: "36b23fff87c72e17640d",
    cluster: "us2",
    encrypted: true
});

router.get("/", (req, res) => {
    res.send("POLL");
});

router.post("/", (req, res) => {
    pusher.trigger("judgeathon", "judge", {
        points: 1,
        os: req.body.os
    });

    return res.json({
        success: true,
        message: "Thanks for your vote"
    });
});

module.exports = router;
