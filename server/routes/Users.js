const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middleware/Auth')

//registration
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 1000).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    }).then(() => {
          res.status(201).json({
              message: 'User added successfully!'
          });
      }).catch((error) => {
        res.status(400).json({error:error});
      });
    });
});

//login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });

    if (!user) { res.json({ error: 'User does not exist' })}
    else {
      bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return res.status(401).json({
            error: new Error('Incorrect password!')
          })}
        else {
          const accessToken = sign(
            { username: user.username, id: user.id }, 
            'supersecret', 
            ).then(() => {
              res.json({token: accessToken, username: username, id: user.id}); 
            }).catch((error) => {
              res.status(400).json({error:error});
          });
        }
      });
    };
});

//checks to see if auth to go into profile
router.get('/user', validateToken, (req, res) => {
  res.json(req.user);
});

//deletes user
router.delete('/user/:id', validateToken, async (req, res) => {
  const userId = req.params.id;

  await Users.destroy({
      where: {
          id: userId,
      },
  }).then(() => {
      res.status(200).json({message: 'Account Deleted'}) 
  }).catch((error) => {
    res.status(400).json({error:error});
  });
});


module.exports = router;