/*
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cron = require('node-cron');
const https = require('https');
const axios = require('axios');


const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

const getFile = require("./route/files.route.js");
app.get("/*", getFile);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = (subject, content) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: '129032699zw@gmail.com',
        subject: subject,
        html: content
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
*/