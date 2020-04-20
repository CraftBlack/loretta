require('dotenv').config();
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
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, hours, minutes, 0, 0);
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

client.on('ready', () => {
    console.log(`Hi, my name is Loretta, and this 👉🏽 (${client.user.tag}) is an awkward id.`);
    setTimers();
});

client.login(process.env.TOKEN);
