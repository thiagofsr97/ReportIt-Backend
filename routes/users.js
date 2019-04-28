import { Router } from 'express';
import { check } from 'express-validator/check';
import moment from 'moment';
import {
  create, authenticate, exclude, update, getAll, getById, logout,
} from '../controllers/users';
import { validateToken } from '../helpers/jwtAuth';
import upload from '../helpers/filesManager';
/* GET users listing. */
const router = Router();

router.post('/login', [check('username', 'Missing username parameter. Lowercase must be used.').not().isEmpty().isLowercase(),
  check('password', 'Missing password parameter.').not().isEmpty()], authenticate);

router.get('/logout', validateToken, logout);

router.get('/', validateToken, getAll);

router.get('/:id', validateToken, getById);

router.put('/:id', upload.single('profile'), [check('dateBirth').custom((dateBirth) => {
  if (dateBirth === undefined) {
    return true;
  }

  const dateFormat = 'YYYY-MM-DD';

  const date = moment(dateBirth, dateFormat, true);

  if (!date.isValid()) {
    throw new Error('Parameter dateBirth is not follwing the format YYYY-MM-DD.');
  }

  return true;
}), check('registrationNumber').custom((registrationNumber) => {
  if (registrationNumber === undefined) {
    return true;
  }
  let content;
  try {
    content = String(registrationNumber);
  } catch (err) {
    throw new Error('Parameter registrationNumber is not a string.');
  }
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  if (!content.match(cpfRegex)) {
    throw new Error('Param registrationNumber does not contain a valid CPF.');
  }
  return true;
})], validateToken, update);

router.delete('/:id', validateToken, exclude);

router.post('/register', upload.single('profile'),
  [check('name', 'Missing name parameter.').not().isEmpty(),
    check('password', 'Missing password parameter.').not().isEmpty(),
    check('username', 'Missing username parameter.').not().isEmpty(),
    check('dateBirth').custom((dateBirth) => {
      if (dateBirth === undefined) {
        throw new Error('Missing dateBirth parameter.');
      }

      const dateFormat = 'YYYY-MM-DD';

      const date = moment(dateBirth, dateFormat, true);

      if (!date.isValid()) {
        throw new Error('Parameter dateBirth is not follwing the format YYYY-MM-DD.');
      }

      return true;
    }), check('registrationNumber').custom((registrationNumber) => {
      if (registrationNumber === undefined) {
        throw new Error('Missing registrationNumber parameter.');
      }
      let content;
      try {
        content = String(registrationNumber);
      } catch (err) {
        throw new Error('Parameter registrationNumber is not a string.');
      }
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
      if (!content.match(cpfRegex)) {
        throw new Error('Param registrationNumber does not contain a valid CPF.');
      }
      return true;
    })], create);

export default router;
