var fs = require('fs'),
	express = require('express'),
	multiparty = require('multiparty'),
	Post = require('../models/postModel'),
	Comment = require('../models/commentModel');

/* Common image upload function */
function _uploadPostPhoto(files, callback) {
	var img = files.photo[0],
		imgName = Date.now()+img.originalFilename;
		
	fs.readFile(img.path, function(err, data) {
		var uploadPath = './public/uploads/' + imgName;
		
		fs.writeFile(uploadPath, data, function(err) {
			if(err) {
				console.log(err);
				res.send('There is some problem uploading the image to the server!');
				return false;
			}
			else {
				console.log('Image name from the private function : ' + imgName);
				callback(imgName);
			}
		});	
	});
}
/* Common image upload function */

exports.getAllPosts = function(req, res) {
	var keyword = req.query.keyword,
	queryString = {};
	
	req.session.myName = 'Ansuman';
	
	if(keyword) {
		queryString = {$or:[ {'title': new RegExp(keyword, 'i')}, {'body': new RegExp(keyword, 'i')}]}; 
	}
	Post.find(queryString).exec(function(err, posts) {
		if(err) {
			res.status(500).render('500');
		}
		else if(!posts) {
			res.status(404).render('404');
		} else {
			res.render('posts', {
				posts: posts,
				keyword: keyword
			});
		}
	});
};

exports.showAddForm = function(req, res) {
	res.render('new', {
		pageTitle: 'New Post'
	});	
};

exports.addEditPosts = function(req, res) {
	var form = new multiparty.Form();
	
	form.parse(req, function(err, fields, files) {
		var title = fields.title,
			body = fields.body,
			author = fields.author;
		
		if(title === '' || body === '' || author === '') {
			res.render('new', {
				formError: 'Please fill up all the fields'
			});
			return false;
		}
		else if(fields.id) {
		// Edit post
			Post.findById(fields.id).exec(function(err, post) {
				if(err) {
					res.status(500).render('500');
				}
				else if(!post) {
					res.status(404).render('404');
				}
				else {
					// Check if there is an existing image uploaded previously - If it's there and not updated then
					// keep that image or replace the new image with the updated one.
					if(files.photo[0].originalFilename === '') {
						post.photo = post.photo;
					}
					else {
						// Delete the existing photo
						fs.unlinkSync('./public/uploads/' + post.photo);
						
						var img = files.photo[0],
						imgName = Date.now()+img.originalFilename;
						
						fs.readFile(img.path, function(err, data) {
							var uploadPath = './public/uploads/' + imgName;
							
							fs.writeFile(uploadPath, data, function(err) {
								if(err) {
									console.log(err);
									res.send('There is some problem uploading the image to the server!');
									return false;
								}
								else {
									console.log('Upload successful');									
								}
							});	
						});
						post.photo = imgName;
					}
					
					post.title = fields.title;
					post.author = fields.author;
					post.body = fields.body;
					
					post.save(function(err) {
						if(err) {
							res.status(500).render('500');
						}
						else {
							res.redirect('/post');
						}
					});
				}
			});
		}
		else {
			// Do form validations here. If form validation is successful then execute the following piece of code.
			_uploadPostPhoto(files, function(imgName) {
				Post.create({
					title: fields.title,
					body: fields.body,
					author: fields.author,
					photo: imgName
				});
				res.redirect('/post');
			});
		}
	});	
};

exports.showEditForm = function(req, res) {
	var id = req.params.id;
	
	Post.findById(req.params.id).exec(function(err, post) {
		if(err) {
			res.status(500).render('500');
		}
		else if(!post) {
			res.status(404).render('404');
		}
		else {
			res.render('new', {
				pageTitle: 'Edit Post',
				post: post
			});
		}
	});
};

exports.getPostDetail = function(req, res) {
	var id = req.params.id;
	Post.findById(req.params.id).exec(function(err, post) {
		if(err) {
			res.status(500).render('500');
		}
		else if(!post) {
			res.status(404).render('404');
		}
		else {
			// Get the comments for the post
			Comment.find({post_id: id}).exec(function(err, comments) {
				if(err) {
					console.log(err);
				}
				else {
					res.render('show', {
						post: post,
						comments: comments
					});
				}
			});

		}
	});
};

exports.deletePost = function(req, res) {
	var id = req.params.id;
	
	Post.findByIdAndRemove(id, function(err, post) {
		if(err) {
			res.status(500).render('500');
		}
		else {
			// Delete the post photo from the folder
			fs.unlinkSync('./public/uploads/' + post.photo);
			
			res.redirect('/post');
		}
	});
};
