const puppeteer = require("puppeteer");
async function webPage(key) {
	const browser = await puppeteer.launch({
		headless: false
	});
	try {
		const page = await browser.newPage();
		await page.goto('https://checkin.uwaterloo.ca/campuscheckin/screen.php?key='+key);
		await page.evaluate(() => {
			document.querySelector('[name=q1][value=No]').click();
			document.querySelector('[name=q2][value=No]').click();
			document.querySelector('[name=q3][value=No]').click();
			document.querySelector('[name=q4][value=No]').click();
			document.querySelector('[name=q5][value=No]').click();
			document.querySelector('[name=q6][value=No]').click();
			document.querySelector('[name=q7][value=No]').click();
			document.querySelector('input[TYPE=SUBMIT]').click(); 
		});
	} catch (e) {
		console.log(e);
	} finally {
		await browser.close();
	}
}
module.exports = webPage;