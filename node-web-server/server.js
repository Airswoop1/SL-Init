console.log("Initializing... ");

var express = require("express");
var http = require("http");
var path = require("path");
var api = require("./api/api.js");
var cors = require("cors");

var app = express();
var server = http.createServer(app);
//var hl_socket = require("./hl_socket.js")(server);


app.set('port', process.env.PORT || 1337);

app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.cookieParser('asdfa9asdfxxc0'));
app.use(express.session());
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
app.use(cors())
app.use(app.router);
app.use(express.static('public'));
//app.use(express.multipart());
app.set('views', path.join(__dirname, 'views'));


api.set_routes(app);


server.listen(app.get('port'), function () {
    console.log('listening on port ' + app.get('port') + " started:  ");
    console.log("Completed Node initialization: " + new Date());
});