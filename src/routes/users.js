import { Router } from 'express';
import { body } from 'express-validator/check';
import moment from 'moment';
import {
  create, authenticate, exclude, update, getAll, getById, logout, deleteAll,
} from '../controllers/users';
import { validateToken } from '../helpers/jwtAuth';
import upload from '../helpers/filesManager';
/* GET users listing. */
const router = Router();
const dateFormat = 'YYYY-MM-DD HH:mm';

router.post('/login', [body('username', 'Missing username parameter.').not().isEmpty(),
  body('password', 'Missing password parameter.').not().isEmpty()], authenticate);

router.get('/logout', logout);

router.get('/', getAll);

router.get('/:id', getById);

router.put('/:id', upload.single('profile'),
  [
    body('name', 'Body name parameter must be a string.').optional().isString(),
    body('username', 'Body username parameter must be a string in lowercase.').optional().isString().isLowercase(),
    body('password', 'Body password parameter must be a string.').optional().isString(),
    body('dateBirth').optional().custom((dateBirth, { req }) => {
      const date = moment(dateBirth, dateFormat, true);

      if (!date.isValid()) {
        throw new Error('Parameter dateBirth is not follwing the format YYYY-MM-DD.');
      }
      req.body.dateBirth = date.toDate();
      return true;
    }),
    body('registrationNumber').optional().custom((registrationNumber) => {
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
    }),
  ], update);

router.delete('/:id', exclude);

router.post('/register', upload.single('profile'),
  [body('name', 'Missing name parameter.').not().isEmpty(),
    body('password', 'Missing password parameter.').not().isEmpty(),
    body('username').not().isEmpty().withMessage('Missing username parameter.')
      .isLowercase()
      .withMessage('Body username parameter must be in lowercase.'),
    body('dateBirth').custom((dateBirth, { req }) => {
      if (dateBirth === undefined) {
        throw new Error('Missing dateBirth parameter.');
      }

      const date = moment(dateBirth, dateFormat, true);

      if (!date.isValid()) {
        throw new Error('Parameter dateBirth is not follwing the format YYYY-MM-DD.');
      }
      req.body.dateBirth = date.toDate();

      return true;
    }), body('registrationNumber').custom((registrationNumber) => {
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


router.delete('/', deleteAll);
export default router;
