var mongodb = require('mongodb'); 
var Server = mongodb.Server('127.0.0.1', 27017, {}); 

new mongodb.Db('scraperapp', Server, {w: 1}).open(function(err, db){ 

	var scrape = new mongodb.Collection(db, 'scrape'); 
	var scrapeFuture = new mongodb.Collection(db, 'scrapeFuture'); 

	scrape.find({url: {$exists: true}}).toArray(function(err, today_docs){ 

		if(!today_docs) return;

		var scrapeFn = function(i){ 
			
			var today_doc = today_docs[i]; 

			scrapeFuture.findOne({url: today_doc.url}, function(err, future_doc){ 

					if(!future_doc) return;

					if(today_doc.headers.server != future_doc.headers.server){ 
						console.log(" URL: " + today_doc.url + "\n" + "Diff: server" + "\n" + "From: " + today_doc.headers.server + "\n" + "  To: " + future_doc.headers.server + "\n"); 
					}

					if(today_doc.headers['x-aspnet-version'] != future_doc.headers['x-aspnet-version']){ 
						console.log(" URL: " + today_doc.url + "\n" + "Diff: x-aspnet-version" + "\n" + "From: " + today_doc.headers['x-aspnet-version'] + "\n" + "  To: " + future_doc.headers['x-aspnet-version'] + "\n"); 
					}

					if(today_doc.headers['x-powered-by'] != future_doc.headers['x-powered-by']){
						console.log(" URL: " + today_doc.url + "\n" + "Diff: x-powered-by" + "\n" + "From: " + today_doc.headers['x-powered-by'] + "\n" + "  To: " + future_doc.headers['x-powered-by'] + "\n");
					}

					if(today_docs[i+1])scrapeFn(i+1);

			}); 
		} 
	scrapeFn(0); 
	}); 
});