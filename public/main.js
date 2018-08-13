const form = document.querySelector("#judgeform");

form.addEventListener("submit", e => {
    e.preventDefault();
    const choice = document.querySelector('input[name="os"]:checked').value;

    const data = { os: choice };

    fetch("http://localhost:4000/poll", {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    })
        .then(resp => resp.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));
});

fetch("http://localhost:4000/poll")
    .then(resp => resp.json())
    .then(json => {
        const votes = json.votes;
        const totalVotes = votes.length;
        console.log(votes);
        const voteCounts = votes.reduce(
            (acc, vote) => (
                (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)),
                acc
            ),
            {}
        );
        updateCanvas(voteCounts, totalVotes);
    });

function updateCanvas(votes, totalVotes) {
    let dataPoints = [
        { label: "Windows", y: votes.Windows },
        { label: "MacOS", y: votes.MacOS },
        { label: "Linux", y: votes.Linux }
    ];
    const chartContainer = document.querySelector("#chartContainer");
    if (chartContainer) {
        const chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "theme2",
            title: {
                text: `OS Results (${totalVotes} Total Votes)`
            },
            data: [
                {
                    type: "column",
                    dataPoints: dataPoints
                }
            ]
        });
        chart.render();

        // Enable pusher logging - don't include this in production
        // Pusher.logToConsole = true;

        const pusher = new Pusher("5ea5a4caef026048c196", {
            cluster: "us2",
            encrypted: true
        });

        const channel = pusher.subscribe("judgeathon");
        channel.bind("judge", function(data) {
            dataPoints = dataPoints.map(x => {
                if (x.label == data.os) {
                    x.y += data.points;
                    return x;
                }
                return x;
            });
            chart.render();
        });
    }
}
