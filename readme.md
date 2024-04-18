# Repo of [GoCodeRemote](https://gocoderemote.com/)

This repository contains the back and front end of the website GoCodeRemote.com. Inside of /server is the Express back-end, and inside of /client is the React front-end. Please keep in mind that although everything is Typescript, I am still in the process of learning and converting the project.

## Description

I started this project in Mar 2024, in my spare time, to learn React and Typescript, and also to be able to use a portfolio to potentially apply for new opportunities.

The idea behind the site is to provide a high quality selection of jobs sourced from careers pages in a structued and normalized format, blending company and meta information, to provide users with the ability to filter, search, and hopefully find a fantastic new opportunity.

## Getting Started

The project is split into two areas: client and server. With the /server being a node application using the express framework, the modules format here is CommonJS, with the front end being ES. Each area has its own tsconfig, /server typescript can be built with tsc whereas /client uses webpack to bundle up everything in dist/bunde.js.

### Dependencies

Sequelize is expecting a database, look in server/config/

Front End: React & Tailwind


### Installing

In the root directory, run

```
npm install
```

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

Which will run the dev server, nodemon and webpack running together.


The front end site runs in its own npm module. So run that too for ts compilation of React
templates and tailwind bundling
```
cd client
npm start
```



## Running tests

To run all tests:
```
npx jest
```
Jest uses puppeteer to E2E test the site that should be running locally.




