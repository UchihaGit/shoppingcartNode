const layout = require('../layout');

module.exports = ({ req }) => {

  return layout({content:
 `
  <div>
  Your ID is ${req.session.userId}
    <form method="POST">
      <input name = "email" placeholder="email" />
      <input name = "password" placeholder="password" />
      <input name = "passwordConfirmation" placeholder="password confirmation" />
      <button name = "">sign up</button>
    </form>
  </div>
 `});
};
