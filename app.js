import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pages from './routes/pages.js'; 
import auth from './routes/auth.js';

dotenv.config({ path: './.env' });

const app = express();

// Config
app.disable('x-powered-by'); // Do Not Identify Express
app.use(express.urlencoded({ extended: true })); // Body Parsing (for POST requests)
app.use(express.json());
app.use(cookieParser());
app.use(compression()); // HTTP Compression
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

// Define Routes
app.use('/', pages);
app.use('/auth', auth);

//Gracefully Handle Errors
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Initiate Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
