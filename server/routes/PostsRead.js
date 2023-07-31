const express = require('express')
const router = express.Router()
const { PostsRead } = require('../models')
const { validateToken } = require('../middleware/Auth')

router.post('/', validateToken, async (req, res) => {
    const { PostId } = req.body;
    const UserId = req.user.id;
  
    const found = await PostsRead.findOne({
         where: {PostId: PostId, UserId: UserId},
         });
    if (!found) {
        await PostsRead.create({PostId: PostId, UserId: UserId})
            res.json({read: true});
    } else {
        await PostsRead.destroy({ 
            where: {PostId: PostId, UserId: UserId},
         })
            res.json({read: false});
    } 
  });

module.exports = router;