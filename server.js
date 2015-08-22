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
app.use(bodyParser.urlencoded({extended:true, limit: '50mb'}));
//app.use(bodyParser.json());
app.use(morgan('dev'));

//app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(express.static(__dirname + '/public'));


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
var cors = require('cors')

//var app = express()
app.use(cors())


var api = require('./app/routes/api')(app,express);
app.use('/api', api);


app.get('/test', function(req,res){
	res.sendFile(__dirname + '/public/test/index.html');
})



app.get('*', function(req,res){
	res.sendFile(__dirname + '/public/views/index.html');
})


app.listen(config.port,function(err){
	if (err) {
		console.log(err);
	}else{
		console.log("Listening on port 3000");
	}
});