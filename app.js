var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var config = require('./config');
var op = require('./op');

var app = express();
app.use(bodyParser.json());
app.use(session({
    secret: require('crypto').randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null, httpOnly: true}
}));
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS')
        res.sendStatus(200);
    else next();
};
app.use(allowCrossDomain);

app.post('/login', function(req, res){
    if(req.body.passwd == config.passwd){
        req.session.views = 1;
        res.sendStatus(200);
    }else{
        res.sendStatus(401);
    }
});

app.post('/logout', function(req, res){
    req.session.destroy(function(){
        res.sendStatus(200);
    });
});

app.post('/delete', function(req, res){
    if(!req.session.views){
        res.sendStatus(401);
    }else if(req.body.key){
        op.deleteFile(req.body.key, function(ret){
            res.sendStatus(200);
        });
    }else{
        res.sendStatus(400);
    }
});

app.get('/list', function(req, res){
    if(req.session.views){
        op.getFileList('', [], function(files){
            res.header('Content-type','application/json');
            res.header('Charset','utf8');
            res.send(req.query.callback + '('+ JSON.stringify(files) + ');');
        });
    }else{
        res.sendStatus(401);
    }
});

app.get('/uptoken', function(req, res){
    if(req.session.views){
        res.header('Content-type','application/json');
        res.header('Charset','utf8');
        var obj = {'upToken': op.getUpToken()};
        res.send(req.query.callback + '('+ JSON.stringify(obj) + ');');
    }else{
        res.sendStatus(401);
    }
});

app.get('/downloadurl', function(req, res){
    if(!req.query.key){
        res.sendStatus(400);
    }else if(req.session.views){
        res.header('Content-type','application/json');
        res.header('Charset','utf8');
        var obj = {'downloadUrl': op.getDownloadUrl(req.query.key)};
        res.send(req.query.callback + '('+ JSON.stringify(obj) + ');');
    }else{
        res.sendStatus(401);
    }
});

app.listen(process.env.VCAP_APP_PORT || 8888);
