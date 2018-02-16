var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require("body-parser");
var PORT = process.env.PORT || 3000;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    var addedUser = false;

    socket.on('new user', function(newUser) {
        if (addedUser) return;
        socket.username = newUser;
        
        addedUser = true;     

        console.log(newUser + " Connected");
    })

    socket.on('chat message', function(msg) {
        io.emit('chat message', (socket.username + ": " + msg));
        console.log(socket.username + ": " + msg);
    });

    socket.on('disconnect', function() {
        console.log(socket.username, ' disconnected');
    });
});


http.listen(PORT, function() {
    console.log('listening on port: ', PORT);
});