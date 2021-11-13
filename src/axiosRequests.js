const axios = require("axios");
const link = 'https://checkin.uwaterloo.ca/campuscheckin/screen.php?key=';
const postData = 'q1=No&q2=No&q3=No&q4=No&q5=No&q6=No&q7=No&q8=No&what=Submit';
const getUKey = async (key) =>{
	try {
		const res = await axios.get(link+key);
		if (res.status == 200) {
			let html = res.data;
			let search = "ukey";
			let index = html.indexOf(search)+13;
			if (index === -1) console.error("Ukey not found");
			else return html.substring(index, index+16);
		} else {
			console.log("error getting ukey");
		}
	} catch (e){
		console.log(e);
	}
}
const sendData = async (key) => {
	let ukey = await getUKey(key);
	let utime = Math.round(Date.now()/1000)-5;
	let customPostData = postData+"&ukey="+ukey+"&utime="+utime;
	try {
		const res = await axios.post(link+key, customPostData);
		if (res.status == 200) return;
		else console.log("error sending data");
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