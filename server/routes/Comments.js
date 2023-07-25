const express = require('express');
const router = express.Router();
const { Comments } = require('../models');
const { validateToken } = require('../middleware/Auth');

// GET request to server to search for postid, then return comments of that post
router.get('/:postId', async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({ where: { PostId: postId }});
    res.json(comments);
});

// route to create comments directly to PostId
router.post('/', validateToken, async (req,res) => {
    const comment = req.body;
    const username = req.user.username;
    comment.username = username;
    await Comments.create(comment);
    res.json(comment);
});

//delete comments
router.delete('/:commentId', validateToken, async (req, res) => {
    const commentId = req.params.commentId;
    await Comments.destroy({
        where: {
            id: commentId,
        },
    })
    res.json({message: "Comment Deleted"}); 
});


module.exports = router;