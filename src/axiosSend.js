const axios = require("axios");
const link = 'https://checkin.uwaterloo.ca/campuscheckin/screen.php?key=';
const postData = 'q1=No&q2=No&q3=No&q4=No&q5=No&q6=No&q7=No&q8=No&what=Submit';
async function sendData(key) {
	try {
		const res = await axios.post(link+key, postData);
		if (res.status == 200) return;
		else console.log("error getting mail");
	} catch (e) {
		console.log(e);
	}
}
module.exports = sendData;