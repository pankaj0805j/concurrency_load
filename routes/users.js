var express = require('express');
var router = express.Router();

const userControlelr = require('../controller/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add_user', userControlelr.addUsers);
router.get('/get_user', userControlelr.getUsers);

router.get('/update_wallet_balance', userControlelr.updateWalletBalance);

module.exports = router;
