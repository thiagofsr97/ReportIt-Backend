import { Router } from 'express';
import { body, query } from 'express-validator/check';
import moment from 'moment';
import { validateToken } from '../helpers/jwtAuth';
import { upload } from '../helpers/filesManager';
import { create, getAll } from '../controllers/occurrences';

const router = Router();

router.post('/create',
  upload.fields([{ name: 'itemsPics', maxCount: 5 }, { name: 'locationPics', maxCount: 5 }]),
  [
    body('description', 'Missing description parameter.').not().isEmpty(),
    body('date').custom((date) => {
      if (date === undefined) {
        throw new Error('Missing date parameter.');
      }


      const dateFormat = 'YYYY-MM-DD';

      const parser = moment(date, dateFormat, true);
      if (!parser.isValid()) {
        throw new Error('Parameter date is not following the format YYYY-MM-DD');
      }

      return true;
    }),
    body('type', 'The type parameter must be assault or robbery.').matches(/^assault$|^robbery$/),
    body('location').custom((location, { req }) => {
      if (location === undefined) {
        throw new Error('Missing location parameter');
      }
      let json = {};
      try {
        json = JSON.parse(location);
      } catch (err) {
        throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
      }
      if (json.lat === undefined || json.lng === undefined) {
        throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
      }

      if (json.lat !== undefined && Number.isNaN(json.lat)) {
        throw new Error('The field lat in location is not numeric.');
      }

      if (json.lng !== undefined && Number.isNaN(json.lng)) {
        throw new Error('The field lng in location is not numeric.');
      }

      req.body.location = json;
      return true;
    }),
    body('itemsLost', 'Missing itemsLost parameter. Parameter must be an array.').not().isEmpty().not()
      .isArray(),
  ],
  create);

router.get('/', [
  query('radius', 'Query radius parameter must be numeric.').optional().isNumeric(),
  query('type').optional().matches(/^assault$|^robbery$/),
  query('date_start').optional().custom((date, { req }) => {
    const dateFormat = 'YYYY-MM-DD';
    const start = moment(date, dateFormat, true);
    if (!start.isValid()) {
      throw new Error('Query date_start parameter is not following the format YYYY-MM-DD.');
    }
    req.query.date_start = start.toDate();
    return true;
  }),
  query('date_end').optional().custom((date, { req }) => {
    const dateFormat = 'YYYY-MM-DD';
    const end = moment(date, dateFormat, true);
    if (!end.isValid()) {
      throw new Error('Query date_end parameter is not following the format YYYY-MM-DD.');
    }
    req.query.date_end = end.toDate();
    return true;
  }),
  query('long', 'Query long parameter must be numeric.').optional().isNumeric(),
], getAll);


export default router;
