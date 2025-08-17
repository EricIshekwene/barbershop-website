require('dotenv').config();
const bcrypt = require('bcryptjs');
const password = process.env.ADMINPASS;

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});