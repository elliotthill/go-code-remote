# Repo of [GoCodeRemote](https://gocoderemote.com/)

This repository contains the back and front end of the website GoCodeRemote.com. Inside of /server is the Express back-end, and inside of /client is the React front-end. Please keep in mind that although everything is Typescript, I am still in the process of learning and converting the project.

## Description

I started this project in Mar 2024, in my spare time, to learn React and Typescript, and also to be able to use a portfolio to potentially apply for new opportunities.

The idea behind the site is to provide a high quality selection of jobs sourced from careers pages in a structued and normalized format, blending company and meta information, to provide users with the ability to filter, search, and hopefully find a fantastic new opportunity.

## Getting Started

The project is split into two areas: client and server. With the /server being a node application using the express framework, the modules format here is CommonJS, with the front end being ES. Each area has its own tsconfig, /server typescript can be built with tsc whereas /client uses webpack to bundle up everything in dist/bunde.js.

### Dependencies

The server is expecting a mysql/mariadb database, you can configure this in /server/config/ and switch to your DB of choice. Sequelize is used as the ORM.

React is used for the front-end, and Tailwind is used as the CSS framework.


### Installing

In the root directory, run

```
npm install
```

(NOTE: you may need to use the flag --force due to an express dependency conflict),

Now we run npm for the front end dependencies in /client:

```
cd /client
npm install
```

THe project was built for Node v 18, I recommend using this same version and installing a tool like NVM to easily switch between versions.

## Running the app

In the root directory run

```
npm start
```

Which will run the dev server, which is basically nodemon and webpack running together.

I suggest using babel with a file watcher, or equivalent, to build your .ts and .tsx files as you go. Babel config is included.

You will also need to build Tailwind CSS as you go

```
npx tailwindcss -i assets/css/style.css -o assets/css/output.css --watch
```
