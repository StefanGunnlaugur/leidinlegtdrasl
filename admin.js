const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/notes';

const express = require('express');

const router = express.Router();

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

router.get('/admin', ensureLoggedIn, async (req, res) => {
  console.log("admin");

  res.render('admin', {});
});

module.exports = router;
