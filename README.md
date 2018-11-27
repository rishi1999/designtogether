# designtogether

designtogether is a collaborative drawing app.

Anyone can download the source code to set up a server, and create a blank canvas. Anyone with the link to the server can start drawing on the canvas in real time.
  
## Installation

First, install npm if you haven't already done so.

Then, clone this repo to your local machine with `git clone https://github.com/rishi1999/designtogether.git`

Go to the directory of the repo in your terminal, and follow the instructions below:

#### To set up a server

    cd server
    npm install

#### To set up the app

    cd client
    npm install
    npm run build
    npm install -g serve

## Usage

Go to the directory of the repo in your terminal, and follow the instructions below:

#### To start a server

    cd server
    npm start

#### To start the app

    cd client
    serve -p 3000 -s build
