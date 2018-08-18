# Judge-a-thon

We should have an app for our hackathons for judges.

# to run this
1) setup mongodb somewhere and change the /config/db.js to point to it
2) run the ```initializedb.txt``` script that will setup a hackathon, two judges, three questions and 2 teams. (change as needed)
3) ```npm i``` in the root directory 
4) ```npm run dev```   *This will the project with browser-sync, sass compile and nodemon . for hot reloading with any changes to the code.

Access ```http://localhost:4000/judges``` and login with one of the judges username and password. 
Once logged in you can choose the team you want to judge. click "GET QUESTIONS" answer the questions and vote 

Get Teams will show you the list of teams and if everyone has voted, the winning order.
 
