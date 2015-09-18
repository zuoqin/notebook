var express=require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var params = require('express-params')
var app = express();

params.extend(app);

mongoose.connect(config.database, function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Connected successfully');
	}

});



app.use('*', function (req, res, next) {
  //console.log('Begin');
  req.rawBody = [];

  req.on('data', function(chunk) { 
    req.rawBody.push(chunk);
  });
  req.on('end', function() {
    //console.log('end');
    req.rawBody = Buffer.concat(req.rawBody);
  });
  next();
});

app.use(bodyParser.urlencoded({extended:true, limit: '50mb'}));
//app.use(bodyParser.json());
app.use(morgan('dev'));

//app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
//var BufferParser = 
app.use(express.static(__dirname + '/public'));


app.use('*', function (req, res, next) {

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



app.get('/favicon/:id', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //console.log("11111");
    res.json({msg: 'This is CORS-enabled for all origins!'});
});


app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});

var cors = require('cors');
app.use(cors());

app.get('*', function(req, res, next){
  //res.json({msg: 'This is CORS-enabled for all origins!'});
  next();
});

//var BufferParser = bodyParser.raw();

//var multer  = require('multer');
//var upload = multer({ dest: 'uploads/' });

//  app.post('/api/weibo/upload', upload.array('photos', 12), function (req, res, next){

  //console.log(req.files);

    //console.log(req.body);
//    res.json({ok:true});

//  });

var api = require('./app/routes/api')(app,express);
app.use('/api', api);


app.get('/test', function(req,res){
	res.sendFile(__dirname + '/public/test/index.html');
})



app.get('*', function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");	
	res.sendFile(__dirname + '/public/views/index.html');
})


app.listen(config.port,function(err){
	if (err) {
		console.log(err);
	}else{
		console.log("Listening on port 3000");
	}
});