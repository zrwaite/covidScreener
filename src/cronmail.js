const cron = require('node-cron');
const {sendData, getData} = require('./axiosRequests');
var usedKeys = [];

const parseData = async() => {
	let emails = await getData();
	let keys = [];
	emails.forEach(email => {
		let subject = "Welcome to Campus - Please complete COVID-19 screening"
		if (email.subject.includes(subject) && email.html !== undefined) {
			let link = "https://checkin.uwaterloo.ca/campuscheckin/screen.php?key=";
			let index = email.html.indexOf(link)+link.length;
			if (index === -1) {
				console.error("Link not found");
			} else {
				let key = email.html.substring(index, index+32);
				if(keys.indexOf(key) === -1) keys.push(key);
				else console.error("duplicate values");
			}
		} else console.error("error: subject or html not found");
	});
	return keys;
}
const screen = async () => {
	const usedKeysNew = [...usedKeys];
	usedKeys = [];
	let keys = await parseData();
	keys.forEach(key =>{
		try{
			if (usedKeysNew.indexOf(key) === -1) {
				sendData(key);
				usedKeysNew.push(key);
			}
				
		} catch (e){
			console.log("COuldn't load webpage");
		}
	})	
	if (keys.length) console.log(keys)
	usedKeys = [...keys]
}
const cronmail = async () => {
	//screen();
	console.log("Working lets goo");
	cron.schedule('* 8-22 * * *', () =>  {
		screen(); 
	});
	cron.schedule('*/5 23,0-7 * * *', () =>  {
		screen(); 
	});
	
}

module.exports = cronmail;