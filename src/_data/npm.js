// https://blog.npmjs.org/post/78719826768/download-counts-are-back
const EleventyFetch = require("@11ty/eleventy-fetch");

function pad(num) {
	return `${num < 10 ? "0" : ""}${num}`;
}
function getDateRange(daysOffset) {
	let date = new Date();
	if(daysOffset) {
		date.setTime(date.getTime() + daysOffset*1000*60*60*24);
	}
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

module.exports = async function() {
	try {
		// let newData = await fetch("https://api.npmjs.org/downloads/point/last-month/@11ty/eleventy")
		let url = `https://api.npmjs.org/downloads/point/${getDateRange(-365)}:${getDateRange()}/@11ty/eleventy`;
		let json = await EleventyFetch(url, {
			type: "json",
			duration: "1d",
			directory: ".cache/eleventy-fetch/",
			dryRun: false,
		});

		return {
			downloads: json.downloads
		};
	} catch(e) {
		if(process.env.NODE_ENV === "production") {
			// Fail the build in production.
			return Promise.reject(e);
		}

		console.log( "Failed getting npm downloads count, returning 0" );
		return {
			downloads: 0
		};
	}
};
