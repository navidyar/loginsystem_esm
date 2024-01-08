import db from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';

// Check If User Logged In
export async function isLoggedIn(req, res, next) {
  if (req.cookies.ebcookie) { //If Cookie Exists
    try {
      // Step 1: Verify The Token
      const decoded = await promisify(jwt.verify)(req.cookies.ebcookie, process.env.JWT_SECRET);
      // Step 2: Check If The User Still Exists in DB
      db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
        if (!result) {
          return next();
        }
        req.user = result[0];
        return next();
      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else { //If Cookie Does NOT Exist
    next();
  }
}

//Login User
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('login', {
        message: 'Please provide an email and password.'
      });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      if (!results || !(await bcrypt.compare(password, results[0].password))) {
        res.status(401).render('login', {
          message: 'Email or password is incorrect'
        });
      } else { // SET COOKIE DATA
        const id = results[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });
        const cookieOptions = {
          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
          httpOnly: true
        }
        res.cookie('ebcookie', token, cookieOptions);
        res.status(200).redirect("/");
      }
    });

  } catch (error) {
    console.log(error);
  }
}

// Logout User
export async function logout(req, res, next) {
  res.cookie('ebcookie', 'logout', { //Overwrite Old Cookie
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true
  });
  res.status(200).redirect('/');
}

// Register User
export function register(req, res) {
  const { name, email, password, passwordConfirm } = req.body; // Destructure

  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }
    if (!name) {
      return res.render('register', {
        message: 'Your name is required.'
      });
    } else if (!email) {
      return res.render('register', {
        message: 'Email required.'
      });
    } else if (!password) {
      return res.render('register', {
        message: 'Password is required.'
      });
    } else if (!passwordConfirm) {
      return res.render('register', {
        message: 'Your password needs to be confirmed.'
      });
    } else if (password !== passwordConfirm) {
      return res.render('register', {
        message: 'Passwords do not match.'
      });
    } else if (results.length > 0) {
      return res.render('register', {
        message: 'That email is already in use'
      });
    }

    let hashedPassword = await bcrypt.hash(password, 8);

    db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (eror, results) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).redirect('/');
      }
    });
  });
}