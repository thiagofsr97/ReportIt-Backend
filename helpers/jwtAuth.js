// import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import createError from 'http-errors';
import JWTR from 'jwt-redis';

const redis = new Redis();
const jwt = new JWTR(redis);

const SECRET = `${process.env.SECRET}`;

const options = {
  expiresIn: '1d',
};

const validateToken = async function (req, res, next) {
  const authorizationHeaader = req.headers.authorization;
  let result;
  if (authorizationHeaader) {
    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

    try {
      // verify makes sure that the token hasn't expired and has been issued by us
      result = await jwt.verify(token, SECRET, options);
      // Let's pass back the decoded token to the request object
      req.decoded = result;
      // We call next to pass execution to the subsequent middleware
      next();
    } catch (err) {
      // Throw an error just in case anything goes wrong with verification
      if (err instanceof JWTR.JsonWebTokenError || err instanceof JWTR.TokenExpiredError) {
        return next(createError(401, ' Authentication error. Token is invalid.'));
      }
      return next(err);
    }
  } else {
    return next(createError(401, 'Authentication error. Token required.'));
  }
};

const destroyJwt = async (id) => {
  await jwt.destroyById(id, options);
};

const signIn = async (payload) => {
  const token = await jwt.sign(payload, SECRET, options);
  return token;
};


export { validateToken, signIn, destroyJwt };
