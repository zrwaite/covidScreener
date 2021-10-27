const axios = require("axios");
const link = 'https://checkin.uwaterloo.ca/campuscheckin/screen.php?key=';
const postData = 'q1=No&q2=No&q3=No&q4=No&q5=No&q6=No&q7=No&q8=No&what=Submit';
const sendData = async (key) => {
	try {
		const res = await axios.post(link+key, postData);
		if (res.status == 200) return;
		else console.log("error getting mail");
	} catch (e) {
		console.log(e);
	}
}
const getData = async () => {
	let lastTime = Date.now()-300000;
	let link = `https://api.testmail.app/api/json?apikey=410b257d-9751-4366-bfec-ede0ec4dd406&namespace=3fsyu&pretty=true&tag=covid&limit=50&timestamp_from=${lastTime}`
	const res = await axios.get(link);
    if (res.status == 200) return res.data.emails;
	else console.log("error getting mail");
}
module.exports = {sendData, getData};