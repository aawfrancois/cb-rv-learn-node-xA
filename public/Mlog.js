const moment = require('moment');
const colors = require('colors');

class Mlog{

	

	Info(string){
	let time = moment().format('LLL');
	console.log(colors.blue(`[${time}] INFO :: ${string}`.blue))

	};

	Err(string){
	let time = moment().format('LLL');
	console.log(colors.red(`[${time}] ERR :: ${string}`))

	};
}

module.exports = new Mlog();

