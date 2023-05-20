const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(bodyParser.urlencoded({extended:true})); //used for wiringup middleware

app.use(cookieSession({
  keys: ['ksdvnnvovojlvkmlkkm']
}));

app.use(authRouter);
//gives response whenever someone makes network request(route handler)


//makes the program to listen to a network request on the given port
app.listen(3000, ()=>{
  console.log('listening');
});
