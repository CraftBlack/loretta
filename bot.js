require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const Discord = require('discord.js');
const client = new Discord.Client();
const events = require('./events');

let invervalsId = [];

const getRemainingMilliseconds = (next, today) => next - today;

const cleanExecutedInternal = () => {
    let timer = invervalsId.shift();
    console.log({ timer });
    clearInterval(timer);
    console.log({ invervalsId }, 'timer cleaned');
};

const afterSendMessage = ([hours, minutes, message]) => {
    cleanExecutedInternal();
    console.log(hours, minutes, message);
    setTimerToSendMessageAt(hours, minutes, message);
};

const sendMessage = args => {
    const [, , message] = args;
    const channel = client.channels.get(process.env.CHANNEL_ID);
    channel.send(message);
    console.log(message);
    afterSendMessage(args);
};

const getDateTimeForNextMessage = ([today, hours, minutes]) => {
    console.log({ td: new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0) })
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0);
};

const getCurrentDateTime = () => new Date();

const setTimerToSendMessageAt = (...args) => {
    const today = getCurrentDateTime();
    const next = getDateTimeForNextMessage([today, ...args]);
    const milliseconds = getRemainingMilliseconds(next, today);
    console.log({ milliseconds });
    const intervalId = setInterval(() => sendMessage(args), milliseconds);
    console.log({ intervalId });
    invervalsId.push(intervalId);
    console.log({ invervalsId });
};

const setTimers = () => {
    events.forEach(({ hours, minutes, message }) => {
        setTimerToSendMessageAt(hours, minutes, message);
    });
};

const setSelfCalling = () => {
    setInterval(() => {
        http.get(`http://loretta-bot.herokuapp.com/`);
    }, 180000);
};

server.listen(process.env.PORT, () => {
    console.log(`Server up 🙌🏼 and running at 👉🏼 ${process.env.PORT} port. 👽`);
    client.on('ready', () => {
        console.log(`Hi, my name is Loretta, and this 👉🏽 (${client.user.tag}) is an awkward id.`);
        setSelfCalling();
        //setTimers();
    });
});

app.get('/', (req, res) => res.send('Hello World!'));

client.login(process.env.TOKEN);
