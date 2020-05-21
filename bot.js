require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const Discord = require('discord.js');
const client = new Discord.Client();
const events = require('./events');

let invervalsId = [];

const cleanExecutedInternal = () => {
    let timer = invervalsId.shift();
    clearInterval(timer);
};

const afterSendMessage = ([hours, minutes, message]) => {
    cleanExecutedInternal();
    setTimerToSendMessageAt(hours, minutes, message);
};

const sendMessage = args => {
    const [, , message] = args;
    const channel = client.channels.get(process.env.CHANNEL_ID);
    channel.send(message);
    afterSendMessage(args);
};

const getRemainingMilliseconds = (next, today) => next - today;

const getDateTimeForNextMessage = ([today, hours, minutes]) => {
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, hours, minutes, 0, 0);
};

const getCurrentDateTime = () => new Date();

const setTimerToSendMessageAt = (...args) => {
    const today = getCurrentDateTime();
    const next = getDateTimeForNextMessage([today, ...args]);
    const milliseconds = getRemainingMilliseconds(next, today);
    const intervalId = setInterval(() => sendMessage(args), milliseconds);
    invervalsId.push(intervalId);
};

const setTimers = () => {
    events.forEach(({ hours, minutes, message }) => {
        setTimerToSendMessageAt(hours, minutes, message);
    });
};

const setSelfCalling = () => {
    setInterval(() => http.get(process.env.DEPLOY_ENDPOINT), 180000);
};

server.listen(process.env.PORT, () => {
    console.log(`Server up 🙌🏼 and running at 👉🏼 ${process.env.PORT} port. 👽`);
    client.on('ready', () => {
        console.log(`Hi, my name is Loretta, and this 👉🏽 (${client.user.tag}) is an awkward id.`);
        setSelfCalling();
        setTimers();
    });
});

app.get('/', (req, res) => res.send('Hello World!'));

client.login(process.env.TOKEN);
