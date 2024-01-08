import express from 'express';
import { register, login, logout } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', function (req, res) {
  register(req, res);
});

router.post('/login', function (req, res) {
  login(req, res);
});

router.get('/logout', function (req, res) {
  logout(req, res);
})

export default router;