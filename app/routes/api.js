var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var secretKey = config.secretKey;
var request = require('request');
var jsonwebtoken = require('jsonwebtoken');
var bodyParser = require('body-parser')

var BufferParser = bodyParser.raw();


var email   = require("emailjs/email");
var server  = email.server.connect({
   user:    "zuoqinr", 
   password:"Qwerty123", 
   host:    "smtp.163.com", 
   ssl:     true
});


function createToken(user){
	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiriesInMinute: 1440
	});
	return token;
}




module.exports = function(app,express){
	var api = express.Router();
	api.post('/signup', function(req,res){
		var user = new User(
		{
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});
		var token = createToken(user);
		user.save(function(err){
			if (err) {
				res.send(err);
				return;
			};

			res.json({
				success: true,
				message:'User has been created!',
				token: token
			});
		});
	});



	api.get('/weibo/token', function(req,res){
		var http = require("https");
		//console.log('Code parameter:');
		//console.log(req.query.code);
	    var opt = {
	          hostname: 'api.weibo.com',
	          path: '/oauth2/access_token?code=' + req.query.code +'&grant_type=authorization_code&client_id=588957036&forcelogon=true&client_secret=d6d06112b69d8c6482dd00f870a78dcf&redirect_uri=http://www.lifemall.com'
	          , method: 'POST'
	         //  headers: {
	         //   'Connection': 'keep-alive',
	         //   'Cache-Control': 'no-cache',
	         //   'Accept' : 
	         //       'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	         //   'User-Agent': 
	         //       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
	         //   'Accept-Encoding': '',
	         //   'Accept-Language': 'ru,en-US;q=0.8,en;q=0.6,zh-CN;q=0.4,zh;q=0.2'
	         // }
	    };
		
		var body = '';
		//Now we're going to set up the request and the callbacks to handle the data
		var request = http.request(opt, function(response) {
		    //When we receive data, we want to store it in a string
		    response.on('data', function (chunk) {
		        body += chunk;
		    });
		    //On end of the request, run what we need to
		    response.on('end',function() {
		        //Do Something with the data
		        console.log(body);
		        res.send(body);
		    });
		});

		//Now we need to set up the request itself. 
		//This is a simple sample error function
		request.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});


		//Write our post data to the request
		//request.write('');
		//End the request.
		request.end();		
		// request.post(
		//     'https://api.weibo.com/oauth2/access_token?code=' + '2f3c013581f25d7f3be781f8ed926dc1' +'&grant_type=authorization_code&client_id=588957036&forcelogon=true&client_secret=d6d06112b69d8c6482dd00f870a78dcf&redirect_uri=http://www.lifemall.com',
		//     '',
		//     function (error, response, body) {
		//         if (!error && response.statusCode == 200) {
		//         	console.log('success post to weibo');
		//             console.log(body);
		//             res.body;
		//         }
		//         else
		//         {

		//         	console.log(response.statusCode);
		//         }
		//     }
		// );
	});

	api.post('/weibo/update', function(req,res){
		var http = require("https");
		//console.log(JSON.stringify(req.headers));
		//console.log('-----------------------------');
		var authorization = req.headers['authorization'];
		var contenttype = req.headers['content-type'];
		//console.log('-----------------------------');
		var input_body = req.body;
		//console.log(req.rawBody);
	    var opt = {
	        hostname: 'api.weibo.com'
	        ,path: '/2/statuses/update.json'
	        ,method: 'POST'
	        ,headers: {
	            'Authorization': authorization,
	            'Content-Type': contenttype
	         //   'Accept' : 
	         //       'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	         //   'User-Agent': 
	         //       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
	         //   'Accept-Encoding': '',
	         //   'Accept-Language': 'ru,en-US;q=0.8,en;q=0.6,zh-CN;q=0.4,zh;q=0.2'
	        }
	    };

		var body = '';
		//Now we're going to set up the request and the callbacks to handle the data
		var request = http.request(opt, function(response) {
		    //When we receive data, we want to store it in a string
		    response.on('data', function (chunk) {
		        body += chunk;
		    });
		    //On end of the request, run what we need to
		    response.on('end',function() {
		        //Do Something with the data
		        //console.log(body);
		        res.send(body);
		    });
		});

		//Now we need to set up the request itself. 
		//This is a simple sample error function
		request.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		request.write(req.rawBody);
		request.end();
		//Write our post data to the request
		//request.write('');
		//End the request.
			
		// request.post(
		//     'https://api.weibo.com/oauth2/access_token?code=' + '2f3c013581f25d7f3be781f8ed926dc1' +'&grant_type=authorization_code&client_id=588957036&forcelogon=true&client_secret=d6d06112b69d8c6482dd00f870a78dcf&redirect_uri=http://www.lifemall.com',
		//     '',
		//     function (error, response, body) {
		//         if (!error && response.statusCode == 200) {
		//         	console.log('success post to weibo');
		//             console.log(body);
		//             res.body;
		//         }
		//         else
		//         {

		//         	console.log(response.statusCode);
		//         }
		//     }
		// );
	});

	api.post('/weibo/upload',  function(req,res){

		var http = require("request");

		var authorization = req.headers['authorization'];
		var contenttype = req.headers['content-type'];
		var fs = require('fs'); //FileSystem module of Node.js

		var boundary = "----WebKitFormBoundary5EaJNmmdPVXH1CBC";
        var data     = "";
        data += "\r\n"
        data += "--" + boundary + "\r\n";
        data += 'Content-Disposition: form-data; name="status"';
        data += "\r\n" + "\r\n";
        data += "My new post......"
        data += "\r\n"
        data += "--" + boundary + "\r\n";
        data += 'Content-Disposition: form-data; name="url"';
        data += "\r\n" + "\r\n";
        data += "http://lifemall.com"
        data += "\r\n"
        var binary = fs.readFileSync(__dirname + '/eeee.png');
        // So, if the user has selected a file
        var nIndex1 = data.length;
        if (binary !== undefined && binary !== null)
        {
            // We start a new part in our body's request
            data += "--" + boundary + "\r\n";

            data += 'Content-Disposition: form-data; name="pic"; filename="shell.png"' + '\r\n';
            data += 'Content-Type: image/jpeg';
            // There is always a blank line between the meta-data and the data
            data += '\r\n';
            data += '\r\n';
            // We happen the binary data to our body's request

            nIndex1 = data.length;
            var nBytes = binary.length;
            for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                data += '1';//binary[nIdx];
           }
           console.log('data.length: ');
           console.log(data.length);
          data +=  '\r\n'; 
        }

        // For text data, it's simpler
        // We start a new part in our body's request
        data += "--" + boundary + "\r\n";
        data += 'Content-Disposition: form-data; name="source"';
        data += '\r\n';
        data += '\r\n';
        data += '588957036'
        data += '\r\n';
        data += "--" + boundary + "--\r\n";

                var nBytes = data.length, ui8Data = new Buffer(nBytes);
                var nIdx = 0
                for (nIdx = 0; nIdx < nBytes; nIdx++)
                {
                    ui8Data[nIdx] = data.charCodeAt(nIdx) & 0xff;
                }

                for (nIdx = 0; nIdx < binary.length; nIdx++)
                {
                    ui8Data[nIdx + nIndex1] = binary[nIdx];// & 0xff;
                }


//var FormData = require('form-data'); //Pretty multipart form maker.
 


// var formData = {
//   // Pass a simple key-value pair
//   source: '588957036',
//   // Pass data via Buffers
//   status: 'jkhhkjjhkjh',
//   // Pass data via Streams
//   my_file: fs.createReadStream(__dirname + '/cat.jpg'),

// };

//POST request options, notice 'path' has access_token parameter
var options = {
    url: 'https://upload.api.weibo.com/2/statuses/upload.json', //'http://localhost:2589/',  //
    headers: {
	            'Authorization': authorization,
	            'Content-Type': contenttype
	        },
    body: ui8Data
}
request.post(options, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log(binary.length);
  console.log(nIndex1);
  console.log('Upload successful!  Server responded with:', ui8Data.toString('utf8'));
  res.send(body);
});		

// var httpreq = require('httpreq');
// //console.log(req.rawBody);
// httpreq.post('https://upload.api.weibo.com/2/statuses/upload.json', {
//     parameters: {
//         source: '588957036',
//         status: 'fsdsfsdfdsf'
//     },
//     binary: true,
//     headers: {
// 	            'Authorization': authorization,
// 	            'Content-Type': contenttype
// 	        },
//     body: req.rawBody
// }, function (err, res){
//     if (err){
//         console.log(err);
//     }else{
//         console.log(res.body.toString('binary'));
//     }
// });



 
// var form = new FormData(); //Create multipart form
// form.append('file', fs.createReadStream(__dirname+'/cat.jpg')); //Put file
// form.append('source', "588957036"); //Put message
// form.append('status', "fsdsfsdfdsf"); //Put message
 
// //POST request options, notice 'path' has access_token parameter
// var options = {
//     method: 'POST',
//     host: 'upload.api.weibo.com',
//     path: '/2/statuses/upload.json',
//     headers: {
// 	            'Authorization': authorization,
// 	            'Content-Type': contenttype
// 	        }
// }
 
//Do POST request, callback for response
//var request = http.request(options, function (res){
     //console.log(res);
//     console.log(res.statusCode);
//});
 //request.on('response', function(res) {
 // console.log(res);
//});
//Binds form to request
//form.pipe(request);
// form.submit(options, function(err, res) {
//  console.log(res);
//});

//If anything goes wrong (request-wise not FB)
//request.on('error', function (error) {
//     console.log(error);
//     console.log('9089098989898');
//});


		//console.log(JSON.stringify(req.headers));
		// console.log('-----------------------------');
		// var authorization = req.headers['authorization'];
		// var contenttype = req.headers['content-type'];
		// console.log(authorization);
		// console.log(contenttype);
		// console.log(req.body);
		// console.log('-----------------------------');
		// var input_body = new Buffer('kjhkjhk');
		// //console.log(req.rawBody);
	 //    var opt = {
	 //        uri: 'https://upload.api.weibo.com/2/statuses/upload.json'
	 //        //,path: '/2/statuses/upload.json'
	 //        ,method: 'POST'
	 //        ,headers: {
	 //            'Authorization': authorization,
	 //            'Content-Type': contenttype
	 //        }
	 //        ,body: input_body
	 //    };




		// var body = '';
		// //Now we're going to set up the request and the callbacks to handle the data
		// request(opt, function (error, response, body) {
		//     if (error) {
		//       return console.error('upload failed:', error);
		//     }
		//     console.log('Upload successful!  Server responded with:', body);
		// });

		//Now we need to set up the request itself. 
		//This is a simple sample error function
		// request.on('error', function(e) {
		//   console.log('problem with request: ' + e.message);
		// });
		//console.log(req.rawBody.toString());
		//var bf = new Buffer(req.rawBody);
		//request.write(bf);
		//request.setEncoding('binary');
		//request.write(req.rawBody);
		//request.end();
		//Write our post data to the request
		//request.write('');
		//End the request.
			
		// request.post(
		//     'https://api.weibo.com/oauth2/access_token?code=' + '2f3c013581f25d7f3be781f8ed926dc1' +'&grant_type=authorization_code&client_id=588957036&forcelogon=true&client_secret=d6d06112b69d8c6482dd00f870a78dcf&redirect_uri=http://www.lifemall.com',
		//     '',
		//     function (error, response, body) {
		//         if (!error && response.statusCode == 200) {
		//         	console.log('success post to weibo');
		//             console.log(body);
		//             res.body;
		//         }
		//         else
		//         {

		//         	console.log(response.statusCode);
		//         }
		//     }
		// );*/
	});


	api.get('/users', function(req,res){
		var ObjectId = require('mongoose').Types.ObjectId;
		var query = {};
		if (req.decoded && req.decoded._id !== undefined && req.decoded._id !== null) {
			query = { _id: new ObjectId(req.decoded._id) };	
		};
		


		User.find(query, function(err, users){
			if (err) {
				res.send(err);
				return;
			};
			res.json(users);
		});
	});

	api.post('/login', function(req,res){
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user){
			if(err){
				throw err;
			}
			if(!user){
				res.send({message:'User does not exist'});
			}else if(user){
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.send({message:"Invalid password"});
				}else
				{
					var token = createToken(user);

					res.json({success:true,
						message: "Successfully login",
						token: token
					});
				}
			}

		});
	});


	api.use(function(req,res,next){
		console.log("Somebody just call app");

		var token = req.headers['x-access-token']; //req.body.token || req.param('token') || 

		if (token) {
			jsonwebtoken.verify(token,secretKey,function(err, decoded){
				if (err) {
					res.status(403).send(
						{success:false,
							message: "Failed to authenticate user"});
				}else{
					req.decoded = decoded;
					next();
				}
			})
		}else{
			res.status(403).send({success:false,
				message: "No token provided"});
		}
	});

	api.route('/')
		.put(function(req, res){
			//console.log("Inside put ");
			//Story.find({_id: req.decoded._id}, function(err, stories){
			//	if (err) {
			//		res.send(err);
			//		return;
			//	};
			//	res.json(stories);
			//console.log(req.body._id);
			//console.log(req.body.title);
			//console.log(req.body.introduction);
			//console.log(req.body.content);
			if (req.body._id.length > 24) {
				req.body._id = '';
				console.log("new item will be insert");
			}else{
				Story.find({_id:req.body._id}, function(err, stories){
					if (err) {
						res.send(err);
						return;
					};
					
					if (stories !== undefined && stories !== null) {
						if (stories.length > 0) {
							if (stories[0].modified > req.body.modified) {
								res.json(stories[0]);
								console.log("newer item was found");
								return;
							}else{
								console.log("older item was found");
							}						
						};
					};
				});

			}




			Story.update({_id:req.body._id},
				{
					title: req.body.title,
					introduction:req.body.introduction,
					topic:req.body.topic,
				 	content: req.body.content,
				 	modified: req.body.modified,
				 	created: req.body.created,
				 	creator: req.decoded._id,
				 	images: req.body.images
				},
				{ upsert: true }, function(err, data){
					if (err) {
						//console.log(err);
						res.send(err);
						return;
					};

					//console.log(data);
					res.json(data);
				}
			)

			// var story = new Story({
			// 	_id: req.decoded._id,
			// 	title: req.body.title,
			// 	introduction: req.body.introduction,
			// 	content: req.body.content
			// });

			// story.save(function(err, data){
			// 	if (err) {
			// 		console.log(err);
			// 		res.send(err);
			// 		return;
			// 	};
			// 	console.log(data);
			// 	res.json(data);
			// })

		})

		.post(function(req,res){
			if (req.body.title !== undefined && req.body.title.length > 0) {
				var story = new Story({
					creator: req.decoded._id,
					title: req.body.title,
					topic: req.body.topic,
					introduction: req.body.introduction,
					content: req.body.content,
				 	modified: req.body.modified,
				 	created: req.body.created,
				 	images: req.body.images
				});
				console.log("To be inserted");
				console.log(req.body.topic);
				story.save(function(err, data){
					if (err) {
						res.send(err);
						return;
					};

					res.json(data);
				})
			};
			if (req.body.datetime !== undefined && req.body.datetime.length > 0) {
				if (req.body.datetime === null || req.body.datetime === undefined) {
					req.body.datetime = new Date(0);
				};
				var fromDate = new Date(req.body.datetime);
				var inputDate = new Date(fromDate.toISOString());
				console.log(fromDate);


				var ObjectId = require('mongoose').Types.ObjectId; 
				var query = { creator: new ObjectId(req.decoded._id),
					modified: {$gte:inputDate} };

				
				Story.find(query, function(err, stories){
					if (err) {
						res.send(err);
						return;
					};
					res.json(stories);
					console.log("Total found stories:");
					console.log(stories.length);
				});				
			}

		})
	
		.get(function(req,res){
			var ObjectId = require('mongoose').Types.ObjectId; 
			var query = { creator: new ObjectId(req.decoded._id) };

			
			Story.find(query, function(err, stories){
				if (err) {
					res.send(err);
					return;
				};
				res.json(stories);
				console.log("Total found stories:");
				console.log(stories.length);
			});
		});

	api.route('/:id')
		.delete(function(req,res){
			Story.remove({ _id: req.params.id },
				function(err, data) {
					if (err) {
						res.send(err);
						return;
					};
					res.json(data);
				}
			);
		});

	api.route('/email/:id')
		.post(function(req,res){
			id = req.params.id;
			stories=[];
			var ObjectId = require('mongoose').Types.ObjectId; 
			var query = { _id: new ObjectId(id) };
			
			Story.find(query, function(err, stories){
				if (err) {
					res.send(err);
					return;
				};
				//console.log(stories.length);
				var contenttype = "image/png";

				//console.log("recipients for this message");
				//console.log(req.body.recipients);

				//console.log("content");
				var msgcontent = " ";
				if (stories[0].content !== null) {
					msgcontent = stories[0].content;
				};
				var msgsubject = "";
				if (stories[0].title !== null) {
					msgsubject = stories[0].title;
				};				
				//console.log(msgcontent);
				//console.log(msgsubject);
				var message = email.message.create(
				{
				   subject: msgsubject,
				   from:   "zuoqinr@163.com",
				   to:      req.body.recipients,
				   text:    msgcontent
				});

				if (stories[0].images !== undefined && stories[0].images !== null) {
					if (stories[0].images.length > 0) {
						if (stories[0].images[0].contentType !== undefined) {
							if (stories[0].images[0].contentType.length > 0)
							{
								contenttype = stories[0].images[0].contentType;
							}
						};


						var i = 0;
                        stories[0].images.forEach(function (image) {
                        	var nStart = 0;
                        	var a = "data:image/png;base64,";
                        	var  nLen1 = a.length;
                        	if (image.data.substring(0, nLen1) === "data:image/png;base64,") {
                        		nStart = nLen1;
                        	};

							a = "data:image/jpeg;base64,";
                        	nLen1 = a.length;
                        	if (image.data.substring(0, nLen1) === "data:image/jpeg;base64,") {
                        		nStart = nLen1;
                        	};

							a = "data:image/bmp;base64,";
                        	nLen1 = a.length;
                        	if (image.data.substring(0, nLen1) === "data:image/bmp;base64,") {
                        		nStart = nLen1;
                        	};
							
							a = "data:image/gif;base64,";
                        	nLen1 = a.length;
                        	if (image.data.substring(0, nLen1) === "data:image/gif;base64,") {
                        		nStart = nLen1;
                        	};


                        	i = i + 1;
                        	var imagename = "image" + i + ".png";
                        	if (stories[0].images[0].pic !== undefined && stories[0].images[0].pic !== null) {
                        		if (stories[0].images[0].pic.length > 0) {
                        			imagename = stories[0].images[0].pic;
                        		};
                        	};
							message.attach(
							{
							   data:image.data.substring(nStart), 
							   type: contenttype, 
							   name:   imagename, 
							   encoded:true
							})
                        });						
					};
				};


				// var message = {
				//    text:    msgcontent,
				//    from:    "zuoqinr@163.com", 
				//    to:      req.body.recipients,
				//    subject: msgsubject
				//    // ,attachment: 
				//    // [
				//    //    {data:msgcontent, alternative:true},
				//    // //   {path:"E:/data/1.doc", type:"application/msword", name:"renamed.doc"}
				//    // ]
				// };				

				server.send(message, function(err, message) {
					if (err) {
						console.log(err || message);	
					};
					
				});
				res.json(stories[0]);

			});
		});

	api.get('/me', function(req,res){
		res.json(req.decoded);
	});
	return api;
};