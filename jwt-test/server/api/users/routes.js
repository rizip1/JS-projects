import express from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';

import { db } from '../db';
import { isUniqueEmail, isUniqueLogin,
         getUserHash, getTokenData } from './functions';
import {
  INVALID_DATA,
  OK,
  DEFAULT_MESSAGE
} from '../responses';

const CREATE_USER_ERROR = 'Could not create user';
const WRONG_CREDS = 'Wrong login or password';
const router = express.Router();

// Token check may come here
router.use((req, res, next) => {
  next();
});


// Login
router.post('/', (req, res) => {
  const { body } = req;
  let response = {
    message: WRONG_CREDS
  };
  if (!body.password || !body.login) {
    res.status(401).json(response);
  }

  const password = body.password.trim();
  const login = body.login.trim();
  getUserHash(login)
    .then((data) => {
      if (data) {
        const { hash, userId } = data;
        bcrypt.compare(password, hash, (err, match) => {
          if (match) {
            const tokenData = getTokenData(userId);
            response.token = tokenData.token;
            response.expires = tokenData.expires;
            response.message = OK;
            res.status(200).json(response);
          } else {
            res.status(401).json(response);
          }
        });
      } else {
        res.status(401).json(response);
      }
    })
    .catch(() => {
      response.message = DEFAULT_MESSAGE;
      res.status(500).json(response);
    });
});


// Add new user
router.post('/new', (req, res) => {
  const { body } = req;
  let response = {
    message: DEFAULT_MESSAGE
  };

  if (!body.password || !body.login || !body.email) {
    response.message = INVALID_DATA;
    res.status(400).json(response);
  }

  const password = body.password.trim();
  const email = body.email.trim();
  const login = body.login.trim();

  if (!validator.isEmail(email) || 
      !validator.isLength(login, {min:6, max:40}) ||
      !validator.isLength(password, {min:6, max:128})) {
    res.status(400).json(response);
  }

  isUniqueEmail(email)
  .then((data) => {
    if (!data) {
      response.message = 'Email exists';
      res.status(409).json(response);
    }
    return isUniqueLogin(login);
  })
  .then((data) => {
    if (!data) {
      response.message = 'Login exists';
      res.status(409).json(response);
    }
    saveUser();
    response.message = OK;
    res.status(200).json(response);
  })
  .catch(() => {
    res.status(500).send(response);
  });

  const saveUser = () => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        res.status(500).json(response);
      }
      var query = 'INSERT INTO users(login, email, password)\
                   VALUES($1, $2, $3) RETURNING id';
      db.one(query, [login, email, hash])
        .then(() => {
          response.message = OK;
          res.status(200).json(response);
        })
        .catch(() => {
          response.message = CREATE_USER_ERROR;
          res.status(500).json(response);
        });
    });
  };
});

export default router;
