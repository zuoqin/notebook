var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

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



	api.get('/users', function(req,res){
		User.find({}, function(err, users){
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

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

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
								contenttype = "image/png";
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
                        	i = i + 1;
							message.attach(
							{
							   data:image.data.substring(nStart), 
							   type:"image/png", 
							   name:"image" + i + ".png", 
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