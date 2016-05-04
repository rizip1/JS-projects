import jwt from 'jwt-simple';

import app from '../api/server';
import { db } from '../api/db';

function auth(req, res, next) {
  req.user = undefined;
  const token = req.headers['x-access-token'];

  console.log('body', req.body);

  if (token) {
    try {
      const decoded = jwt.decode(token, app.get('jwtTokenSecret'));
      const id = decoded.iss;

      if (decoded.exp <= Date.now()) {
        return res.end('Access token has expired', 400);
      }
      
      verifyUser(id)
      .then((status) => {
        if (status) {
          req.user = id;
        }
        next();
      })
      .catch(() => {
        next();
      });
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
}

function verifyUser(id) {
  return db.any('SELECT id FROM users WHERE id = $1 and active = true', [id])
    .then((data) => {
      return data.length ? true : false;
    })
    .catch(() => {
      return false;
    });
}

export default auth;
