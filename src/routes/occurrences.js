import { Router } from 'express';
import { body, query } from 'express-validator/check';
import moment from 'moment';
import { validateToken } from '../helpers/jwtAuth';
import upload from '../helpers/filesManager';
import {
  create, getAll, update, getById, getByUserId,
} from '../controllers/occurrences';

const router = Router();
const dateFormat = 'YYYY-MM-DD';

router.post('/create',
  upload.fields([{ name: 'itemsPics', maxCount: 5 }, { name: 'locationPics', maxCount: 5 }]),
  [
    body('id', 'Missing id parameter.').not().isEmpty(),
    body('description', 'Missing description parameter. Parameter must be a string.').not().isEmpty().isString(),
    body('date').custom((date, { req }) => {
      if (date === undefined) {
        throw new Error('Missing date parameter.');
      }


      const parser = moment(date, dateFormat, true);
      if (!parser.isValid()) {
        throw new Error('Body date parameter is not following the format YYYY-MM-DD');
      }

      req.body.date = parser.toDate();
      return true;
    }),
    body('type', 'The type parameter must be assault or robbery.').matches(/^assault$|^robbery$/),
    body('location').custom((location, { req }) => {
      if (!location) {
        throw new Error('Missing location parameter');
      }
      let json = {};
      try {
        json = JSON.parse(location);
      } catch (err) {
        throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
      }
      if (!json.lat || !json.lng) {
        throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
      }

      if (!json.lat && Number.isNaN(json.lat)) {
        throw new Error('The field lat in location is not numeric.');
      }

      if (json.lng && Number.isNaN(json.lng)) {
        throw new Error('The field lng in location is not numeric.');
      }

      req.body.location = { type: 'Point', coordinates: [json.lng, json.lat] };
      return true;
    }),
    body('itemsLost', 'Missing itemsLost parameter. Parameter must be an array.').not().isEmpty().isArray(),
  ],
  create);

router.get('/', [
  query('radius', 'Query radius parameter must be numeric.').optional().isNumeric(),
  query('type').optional().matches(/^assault$|^robbery$/),
  query('date_start').optional().custom((date, { req }) => {
    const start = moment(date, dateFormat, true);
    if (!start.isValid()) {
      throw new Error('Query date_start parameter is not following the format YYYY-MM-DD.');
    }
    req.query.date_start = start.toDate();
    return true;
  }),
  query('date_end').optional().custom((date, { req }) => {
    const end = moment(date, dateFormat, true);
    if (!end.isValid()) {
      throw new Error('Query date_end parameter is not following the format YYYY-MM-DD.');
    }
    req.query.date_end = end.toDate();
    return true;
  }),
  query('long', 'Query long parameter must be numeric.').optional().isNumeric(),
  query('latt', 'Query latt parameter must be numeric.').optional().isNumeric(),
], getAll);

router.get('/:id', getById);
router.get('/user/:id', getByUserId);


router.put('/:id', [
  body('description', 'Body description parameter must be a string.').optional().isString(),
  body('date').optional().custom((newDate, { req }) => {
    const date = moment(newDate, dateFormat, true);
    if (!date.isValid()) {
      throw new Error('Body date parameter is not following the format YYYY-MM-DD.');
    }
    req.body.date = date.toDate();
    return true;
  }),
  body('type', 'The type parameter must be assault or robbery.').optional().matches(/^assault$|^robbery$/),
  body('location').optional().custom((location, { req }) => {
    let json = {};
    try {
      json = JSON.parse(location);
    } catch (err) {
      throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
    }
    if (!json.lat || !json.lng) {
      throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
    }

    if (json.lat && Number.isNaN(json.lat)) {
      throw new Error('The field lat in location is not numeric.');
    }

    if (json.lng && Number.isNaN(json.lng)) {
      throw new Error('The field lng in location is not numeric.');
    }

    req.body.location = { type: 'Point', coordinates: [json.lat, json.lng] };
    return true;
  }),
  body('itemsLost', 'Body itemsLost parameter must be an array.').optional().isArray(),
], update);

export default router;
