const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    handleValidationErrors
  ];

  router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
      const { email, password, username, firstName, lastName } = req.body;
      
      const emailE = await User.findOne({
        where: {email}
      })
      if(emailE) {
        const err = new Error(`User already exists`)
        err.errors = { email: "User with that email already exists" }
        err.status = 403;
        return next(err)
      }
      const usernameE = await User.findOne({
        where: { username } 
      });
      if (usernameE) {
        const err = Error("User already exists");
        err.errors = { username: "User with that username already exists" };
        err.status = 403;
        return next(err);
      }
      const user = await User.signup({ email, username, password, firstName, lastName });
      const tc = await setTokenCookie(res, user);
  
      return res.json({ user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        //token: tc
      }});
    }
  );

module.exports = router;