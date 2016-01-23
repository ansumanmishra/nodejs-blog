var express = require('express'),
	router = express.Router(),
	Comment = require('../models/commentModel');

router.post('/:pid/comment', function(req, res) {
	var comment_desc = req.body.comment_desc,
		comment_author = req.body.comment_author;
		
	if(comment_desc === '' || comment_author === '') {
		res.send('Please enter your name and your comment.');
		return false;
	}
	else {
		Comment.create({
			comment_desc: comment_desc,
			comment_author: comment_author,
			post_id: req.params.pid
		}, function(err, comments) {
			if(err) {
				res.status(500).render('500');
			}
			else {
				res.redirect('/post/'+req.params.pid);
			}
		});
	}
});
	
router.get('/:pid/comment/:cid/delete', function(req, res) {
	Comment.findByIdAndRemove(req.params.cid, function(err) {
		if(err) {
			res.status(500).render('500');
		}
		else {
			res.redirect('/post/' + req.params.pid);
		}
	});
});

module.exports = router;