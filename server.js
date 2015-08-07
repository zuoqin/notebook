var express=require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();

mongoose.connect(config.database, function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Connected successfully');
	}

})
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));


var api = require('./app/routes/api')(app,express);
app.use('/api', api);


app.get('/test', function(req,res){
	res.sendFile(__dirname + '/public/test/index.html');
})



app.get('/mm', function(req,res){
	res.sendFile(__dirname + '/public/views/index.html');
})


app.listen(config.port,function(err){
	if (err) {
		console.log(err);
	}else{
		console.log("Listening on port 3000");
	}
});