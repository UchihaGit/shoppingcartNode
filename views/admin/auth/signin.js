const layout = require('../layout');

function innerLayout() {
  console.log("in layout");
  layout(`<p>para</p>`)
}

innerLayout();
// console.log('in signin');
// module.exports = () => {
//   // return layout();
//
//
//
// };
