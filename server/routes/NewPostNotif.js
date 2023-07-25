const express = require('express')
const router = express.Router()
const { NewPostNotif } = require('../models')
const { validateToken } = require('../middleware/Auth')

//request to like and unlike
// router.post('/', validateToken, async (req, res) => {
//     const { PostId } = req.body;
//     const UserId = req.user.id;

//     const found = await NewPostNotif.findOne({
//          where: {PostId: PostId, UserId: UserId},
//          });
//     if (!found) {
//         await NewPostNotif.create({ PostId: PostId, UserId: UserId })
//             res.json({read: true});
//     } else {
//             res.json({read: false});
//     }
// });


module.exports = router;