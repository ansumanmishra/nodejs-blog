var express = require('express');
var router = express.Router();

/* GET admin home page. */
router.get('/', function(req, res) {
	res.render('../views/admin/index', {
		
	});
});

module.exports = router;
