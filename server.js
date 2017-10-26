const http = require('http');
const fs = require('fs');
const path = require('path');
const Alog = require('./public/Mlog');
const uuid = require('./node_modules/uuid');
const _ = require('lodash');

const port = process.argv[2] || 8080;
const server = http.createServer((req,res) => {

	if (req.method == 'GET') {
	  req.url = req.url == '/' ? 'index.html' : req.url;

		  	if (req.headers.cookie){
		  		let cookie = _.split(req.headers.cookie, '=');
		  		let getCookie = cookie[1];
		  		let content = fs.readFileSync(`./.sessions/${getCookie}`, 'UTF-8')
		  		res.setHeader('x-my-user-data', `${content}`);
			};

		  fs.createReadStream(path.join(__dirname, req.url), {flags: 'r'})
		  .on ('open', (err) => {
		  	res.statusCode = 200;
		    Alog.Info(`Server running on port: ${port}`);
		  })
		  .on('error', (err) => {
		    let content = fs.readFileSync(path.join(__dirname, '404.html'));
		    res.statusCode = 404;
		    Alog.Err(`${req.url} doesn't exist`);
		    res.end(content);
		  })
	  .pipe(res);
  	}

  	if (req.method == 'POST' && req.url == '/add-session') {
        var data = '';
        let uniqueId = uuid.v4();

        res.setHeader('set-Cookie', `sessionID=${uniqueId}; expires=`+new Date(new Date().getTime()+ 60000).toGMTString() );
	  	req.on('data', function (bigdata) {
		  	res.writeHead(200);
		    data += bigdata;
		    
		    fs.writeFile(`./.sessions/${uniqueId}`, `${data}`, function(err) {
			    if(err) {
			        return console.log(err);
			    }
				
				console.log("The file was saved!");
			}); 
		    console.log(data);
		    res.end();
	    });
    }
});

server.listen(port, (err) => {
  if (err) throw err;
});