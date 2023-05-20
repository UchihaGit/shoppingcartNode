
const express = require('express');
const userRepo = require('../../repository/users');
const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate = require('../../views/admin/auth/signin')



const router = express.Router();

router.get('/signup', (req, res)=>{
  res.send(signupTemplate({ req }));
});

//Middleware function behind the seens
// const bodyParser = (req, res, next) => {
//   if(req.method==='POST'){
//     req.on('data', data =>{
//       const parsed = data.toString('utf8').split('&');
//       const formData = {};
//       for (let pair of parsed) {
//         const [key, value] = pair.split('=');
//         formData[key] = value;
//       }
//       req.body = formData;
//       next();
//     });
//   } else{
//     next();
//   }
// }

router.post('/signup', async (req, res)=>{
  const {email, password, passwordConfirmation} = req.body;

  const existingUser = await userRepo.getOneBy({email});

  if (existingUser) {
    return res.send('email already in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('password did not match');
  }

  //create this user in user repo to represent this person
  const user = await userRepo.create({email, password});

  req.session.userId = user.id; //req session stores a object- so we can add any property we want
  res.send('account created');
})


// signIn
router.get('/signin', async(req, res)=>{
 res.send(signinTemplate());
  console.log("in auth");


})

router.post('/signin', async (req, res)=>{
  const {email, password} = req.body;
  const user = await userRepo.getOneBy({email});

  if(!user){
    return res.send('email inot found')
  }

  const validPassword = await userRepo.comparePasswords(user.password, password)

  if(!validPassword){
    return res.send('Password Incorrect')
  }

  req.session.userId = user.id;

  res.send('You are signed in');

})
//logout
router.get('/signout', async (req, res)=>{
  req.session = null;
  res.send('You are logged out');
})

module.exports = router;
