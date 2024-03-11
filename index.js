const dbConnect = require('./connection');
const express = require('express');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const friendRoute = require('./routes/friend');
const chatRoute = require('./routes/chat');
const regionRoute = require('./routes/region');
const profileRoute = require('./routes/profile');
const homeRoute = require('./routes/home');

const {webSocketConnect} = require('./io')

const PORT= 8001;
const app = express();
const http = require('http').createServer(app);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    next();
 });
http.listen(PORT,()=>console.log('server created successfully'));
const {Server} = require('socket.io');
const io =  new Server(http, {
    cors:{
        origins: ['http://localhost:4200']
    }
},{
        connectionStateRecovery: {},
        // adapter: createAdapter()
      });
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/user', userRoute);
app.use('/user/post', postRoute);
app.use('/user/friend', friendRoute);
app.use('/user/conversation', chatRoute);
app.use('/region',regionRoute);
app.use('/user/profile',profileRoute);
app.use('/home',homeRoute)

if(io)
{
    webSocketConnect(io);
}
