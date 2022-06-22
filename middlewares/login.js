const express = require('express');
const crypto = require('crypto');
const { validateEmail, validatePass } = require('./validateLogin');

const login = express.Router();

login.post('/', validateEmail, validatePass, async (req, res) => {
  const { email, password } = req.body;
  const validate = /\S+@\S+\.\S+/;

  if (validate.test(email) && password.length >= 6) {
    const token = crypto.randomBytes(8).toString('hex');
    return res.status(200).json({ token });
  }
});

module.exports = login;