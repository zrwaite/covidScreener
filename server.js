const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cron = require('node-cron');
const https = require('https');
const axios = require('axios');
const FormData = require('form-data');

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
 

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

var form = new FormData();
form.append('MIME Type', 'application/x-www-form-urlencoded');
form.append('q1', 'No');
form.append('q2', 'No');
form.append('q3', 'No');
form.append('q4', 'No');
form.append('q5', 'No');
form.append('q6', 'No');
form.append('q7', 'No');
form.append('q8', 'No');
form.append('what', 'Submit');
var headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://checkin.uwaterloo.ca",
    "Content-Length": "59",
    "Accept-Language": "en-ca",
    "Host": "checkin.uwaterloo.ca",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
    "Referer": "https://checkin.uwaterloo.ca/campuscheckin/screen.php?key=qeAuo3Ro3zMDyUWO32af5O0TUlMEOgBw",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
};
var key = "qeAuo3Ro3zMDyUWO32af5O0TUlMEOgBw";
axios({
    method: "post",
    url: "https://checkin.uwaterloo.ca/campuscheckin/screen.php?key="+key,
    data: form,
    headers: {"Content-Type": "multipart/form-data"},
}).then((res) =>{
    console.log(res.data);
}).catch((err) =>{
    console.log(err);
});

const lastTime = Date.now()-900000;

const requestOptions = {
    hostname: 'api.testmail.app',
    port: 443,
    path: `/api/json?apikey=410b257d-9751-4366-bfec-ede0ec4dd406&namespace=3fsyu&pretty=true&tag=covid&timestamp_from=${lastTime}`,//
    method: 'GET' 
}

const task = cron.schedule('*/15 * * * *', () =>  {
    let req = https.request(requestOptions, res => {
        console.log(`statusCode: ${res.statusCode}`);
        let emails = ""
        res.on('data', (d) => {
            emails += d;
        })
        res.on('end', () => {
            let link = "https://checkin.uwaterloo.ca/campuscheckin/screen.php?key=";
            try{json = JSON.parse(emails);} 
            catch (error) {console.error(error.message);}
            if (json.result){
                numEmails = json.count;
                console.log(json.count);
                for (let i = 0; i<json.count; i++){
                    let email = json.emails[i];
                    let message = email.html;
                    if (message){
                        if (email.subject=="Fwd: Welcome to Campus - Please complete COVID-19 screening"){
                            console.log(email.from);
                            index = message.indexOf(link)+link.length;
                            key = message.substring(index, index+32);
                            console.log(key); 
                            //Send post request with key
                        }
                        else {sendEmail("Email server error", message);}
                    }
                    else {sendEmail("Email server error", email.text);}
                }
            }
        })
    })
    req.on('error', error => {
        console.error(error);
    })
    req.end();
});

module.exports = app;