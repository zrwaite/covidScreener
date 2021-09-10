const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cron = require('node-cron');
const https = require('https');
const form_data = require('form-data');

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

const covidOptions = {
    hostname: 'checkin.uwaterloo.ca',
    port: 443,
    path: '/campuscheckin/screen.php?key=oRWoNPa7LWMW5CBzkkSJcUQZJHmuPE3R',
    method: 'POST',
};

const covidData = {
    q1: 'No',
    q2: 'No',
    q3: 'No',
    q4: 'No',
    q5: 'No',
    q6: 'No',
    q7: 'No',
    q8: 'No',
    what: 'Submit'
}

var form = new form_data();
form.append('q1', 'No');
form.append('q2', 'No');
form.append('q3', 'No');
form.append('q4', 'No');
form.append('q5', 'No');
form.append('q6', 'No');
form.append('q7', 'No');
form.append('q8', 'No');
form.append('what', 'Submit');

var request = https.request({
    method: 'POST',
    host: 'checkin.uwaterloo.ca', //httpbin.org
    path: '/campuscheckin/screen.php?key=oRWoNPa7LWMW5CBzkkSJcUQZJHmuPE3R', // /post?key=this
    headers: form.getHeaders()
});

form.pipe(request);

request.on('response', function(res) {
    console.log(res.statusCode);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
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