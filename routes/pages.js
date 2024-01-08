import express from 'express';
import { isLoggedIn } from '../controllers/auth.js';
const router = express.Router();

// User Logged In?
router.get('/', isLoggedIn, (req, res) => {
  if (req.user) {
    res.render('index', {
      title: 'Homepage',
      heading: 'Homepage',
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

// Register User
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'User Registration',
    heading: 'Register User'
  });
});

// User Login
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'User Login',
    heading: 'User Login',
  });
});

// User Profile
router.get('/profile', isLoggedIn, (req, res) => {
  if (req.user) {
    res.render('profile', {
      title: 'Profile',
      heading: 'My Profile',
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
});

export default router;