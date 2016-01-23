var express = require('express'),
	router = express.Router(),
	postController = require('../controllers/postController');

/* GET users listing. */
router.get('/', postController.getAllPosts);

/* Show the add post form */
router.get('/new', postController.showAddForm);

/* Add the post */
router.post('/add-post', postController.addEditPosts);

/* Show the detail of a post */
router.get('/:id', postController.getPostDetail);

/* Show the Edit post form */
router.get('/:id/edit', postController.showEditForm);

/* Delete the post */
router.delete('/:id/delete', postController.deletePost);

module.exports = router;