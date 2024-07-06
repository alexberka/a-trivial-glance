# A Trivial Glance [![Netlify Status](https://api.netlify.com/api/v1/badges/be3b3dcc-b49e-4cb0-b1f0-c1ebf7a8c3f7/deploy-status)](a-trivial-glance.netlify.app)
A Trivial Glance is designed to augment live in-person trivia events, such as those commonly run at bars and restaurants as mid-week entertainment.

Whether as the result of background noise, an insufficient PA system, questions with unfamiliar or foreign names and words, bathroom breaks, or that one heated cross-table discussion about "Pet's Mart" vs. "Pet Smart" monopolizing a team's attention, communicating with the entire room of participants is a constant challenge.

A Trivial Glance virtualizes the question-answer process, ironing communication snags and increasing game accessibility. It provides hosts with a game and question management interface, real-time answer alerts, and one-click scoring, while allowing teams to view the question, submit an answer, and get feedback all on their mobile devices.

## Features
### Host Tools:
- Build a database of reusable questions and games
- Sort questions into games
- Run games from single-view game display with drag-and-drop questions between four statuses:
  - Unused (questions yet-to-be-shown)
  - Open (question that players can submit an answer to, one at a time per game)
  - Closed (questions that are not accepting answers but do not yet have the correct answer visible)
  - Released (questions for which players can see the correct answer and whether)
- Pop-up answer panel to review and grade submitted answers


_Question Database_

![Questions](./assets/ATG%20Host%20Questions.png)


_Add/Remove Question To/From Games_

![Manage Question](./assets/ATG%20Host%20Manage%20Question.png)


_Host Game Management Interface_

![Game Display](./assets/ATG%20Host%20Game%20Display.png)


_Pop-Up Answer Panel_

![Answer Panel](./assets/ATG%20Host%20Answer%20Panel.png)


### Player Tools:
- Search all live games
- Create a team name (persists with user for single game only)
- Mobile-ready game display to view current question
- Pop-up answer panel to submit answers and review past questions


_Select Live Game_

![Live Games](./assets/ATG%20Player%20Game%20Select.png)


_Fullscreen Game Display_

![Player Game Display](./assets/ATG%20Player%20Fullscreen.png)


_Mobile Game Display_

![Mobile Game Display](./assets/ATG%20Player%20Mobile.png)


## Get Started
Clone this repo and enter the following command in the project folder:

```
npm install
```

Once installation has completed, enter this command to launch the project locally:

```
npm run dev
```

If project does not open automatically in browser, click provided localhost link.

## Development Links
[Current Deployment on Netlify](a-trivial-glance.netlify.app)

[Concept Wireframes](https://www.figma.com/design/4WN0zZKb9xRZ8Xg0SG2YNQ/A-Trivial-Glance?node-id=0-1)

[Project Board](https://github.com/users/alexberka/projects/2)

[Entity Relationship Diagram](https://dbdiagram.io/d/A-Trivial-Glance-6642a01b9e85a46d55c05463)

App Walkthrough Coming Soon

## A Note From The Developer:
There is perhaps concern that trivia goers will be tempted to cheat and look up the answers if they have their phones in front of them. Well... let them. If somebody's cheating playing bar trivia, they're just an awful person, and no amount of reprimand or vigilant screen policing is going to change that. Though I find a little pre-game reminder floated into the crowd to be a cathartic experience, if not a particularly effective one.

And if you, curious being, whose eyes are READing this ME, find yourself in the company of some such trivia cheater, whether your relationship to said miscreant is romantic, platonic, familial, professional, circumstantial, didactic, cursory, ecclesiastical, or court-ordered, I would urge you to seriously reconsider who you're spending your time around. If they will cheat for a free meal (or one of whatever ephemera are being proffered as prizes), imagine what they'll do for something that really matters.

It is, after all, just a silly game.

## The Name Of The Developer:
Alex Berka (A Trivia Host)
