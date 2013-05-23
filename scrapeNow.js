var dburl = 'localhost/scraperapp';
var collections = ['scrape'];
var db = require('mongojs').connect(dburl, collections);

var http = require("http");
var fs = require("fs");

var i = 0;

db.scrape.remove();

db.scrape.ensureIndex("url",function(e){
  console.log("Error while indexing");
});

fs.readFile(__dirname + '/hostNames.txt','utf8', function(err,data){

	var hostNames = data.split("\r"); // Specify \n or \r

	for (i; i < hostNames.length; i++){
		var options = {
  			host: hostNames[i],
  			path: '/'
		};
	
 		(function (i){
  			http.get(options, function(res) {

    		    var obj = {};
    		    obj.url = hostNames[i];
            obj.date = Date()
            obj.headers = {
              "server":res.headers["server"],
              "x-aspnet-version":res.headers["x-aspnet-version"],
              "x-powered-by":res.headers["x-powered-by"]
            }
            // obj.headers={};
            // for(var item in res.headers){
            //   obj.headers[ item.replace(/\./,'\\')] = res.headers[item];
            // }

     	   		db.scrape.save(obj);

  			}).on('error',function(e){
        console.log("Error: " + hostNames[i] + "\n" + e.stack);
        })
  	})(i);

		console.log((i+1) + " out of " + hostNames.length + " being sent out.");

	};

	console.log("All URLs parsed. Await completion. Error log starting:\n ______________________________");

});