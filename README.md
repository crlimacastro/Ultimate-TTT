# Ultimate Tic Tac Toe

## Documentation

[Documentation](https://github.com/crlimacastro/crl3554-430-project-2/blob/master/documentation.md)

## Table of Contents

- [Purpose](#what-your-site-does-and-what-its-purpose-is)
- [Use of React](#how-are-you-using-react-what-is-it-being-used-to-show)
- [Use of MongoDB](#what-type-of-data-are-you-storing-in-mongo)
- [Use of Handlebars](#how-are-you-making-use-of-handlebars)
- [Above and Beyond](#how-are-you-going-above-and-beyond)
- [Sources](#sources)


## What your site does and what its purpose is.

[Table of Contents](#table-of-contents)

---

The site is an online service to create user accounts and play games of Ultimate Tic Tac Toe online with other people. Players can create and join publicly available rooms and play against or spectate a game of Ultimate Tic Tac Toe in that room. Players in rooms can also send messages to each other through the chat and spectators can also chat among themselves but not with the players of the game (so they cannot help them).

Player accounts also track stats like their win/loss ratio and how many games they have played in total so users can look at them and work towards improving their stats.

## How are you using React? What is it being used to show?

[Table of Contents](#table-of-contents)

---

The site uses a 2 page structure. An initial landing page for login/signup functionalities and a second page at the '/app' endpoint where most of the game functionalities are found. React is being used to render dynamic components seen on screen like:
- the list of games
- the game board
- the surrender/leave control buttons
- the chat
- etc...

Some components are conditionally rendered. Like the surrender button which won't appear to spectators. Functional components with hooks are being used to render and re-render dynamic components like the board and the chat which change every time a player takes a turn or sends a message.

## What type of data are you storing in Mongo?

[Table of Contents](#table-of-contents)

---

In Mongo, I am storing:
1. Player Accounts
2. Game Rooms

The Player Accounts store identity and login information like the player's username and encrypted password as well as their game history stats. It stores stats like the amount of games the user has played, how many they won, how many they lost, etc.

The Game Rooms are created by the users and they store information vital to the flow of the game and the state of the room. They store information such as the usernames of the two accounts playing against each other, a container for all the spectators that are in the game, the state of the board, what player's turn it is, where was the last turn played (to determine the possible moves for the next one), which player was the winner, etc.

## How are you making use of Handlebars?

[Table of Contents](#table-of-contents)

---

Handlebars is being used to render base HTML components shared by all pages in the site. Things like the navigation bar at the top of the page, the body element, etc. The Handlebars templates also contain the script imports for React and Socket.io.

## How are you going above and beyond?

[Table of Contents](#table-of-contents)

---

Using Socket.io for real-time WebSocket communication between the client in the server is the big above and beyond aspect of my project. I used Socket.io to create this real-time back-and-forth communication between the server and the client so the game board is updated in real time. I used to create the chat functionality inside the rooms.

More specifically though, I also used Socket.io's room creation and joining features to separate users' games and have multiple concurrent real-time games happening at the same time without them affecting each other. I also created separate chat rooms that players and spectators join into when joining a room to make it so spectators can see messages from both players and spectators, but players can only see messages between each other.

I also made it so the game rooms communicate with the user accounts and update their stats (games played, games won, etc.) when a game is over so players can track their Ultimate Tic Tac Toe gaming history.


## Sources

[Table of Contents](#table-of-contents)

---

### Icons

https://www.flaticon.com/free-icon/tic-tac-toe_1073293

https://www.flaticon.com/free-icon/tic-tac-toe_1073242

### Code

[How to manually convert JavaScript Objects to x-www-form-urlencoded](https://stackoverflow.com/questions/39786337/how-to-convert-js-object-data-to-x-www-form-urlencoded)

[Socket.io rooms](https://socket.io/docs/v3/rooms/)

[Mongoose Documentation](https://mongoosejs.com/docs/index.html)
