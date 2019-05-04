import { validationResult } from 'express-validator/check';
import createError from 'http-errors';
import moment from 'moment';
import { Error as errMongo } from 'mongoose';
import Occurrence from '../models/occurrence';

const create = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }

  try {
    const {
      description, date, type, location, itemsLost,
    } = req.body;
    const occurrence = new Occurrence({
      description,
      date: moment(date),
      type,
      itemsLost,
      location: { type: 'Point', coordinates: [location.lat, location.lng] },
    });

    if (req.files !== undefined) {
      const { itemsPics, locationPics } = req.files;

      if (itemsPics !== undefined) {
        occurrence.itemsPics = [];
        itemsPics.forEach((picture) => {
          const { url, secure_url, public_id } = picture;
          occurrence.itemsPics.push({
            url,
            secureUrl: secure_url,
            id: public_id,
          });
        });
      }

      if (locationPics !== undefined) {
        occurrence.locationPics = [];
        locationPics.forEach((picture) => {
          const { url, secure_url, public_id } = picture;
          occurrence.locationPics.push({
            url,
            secureUrl: secure_url,
            id: public_id,
          });
        });
      }
    }

    const occurenceSaved = await occurrence.save();

    const result = {};
    result.result = occurenceSaved;
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const getAll = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }
  try {
    const {
      date_start, date_end, radius, type, long, latt,
    } = req.query;
    const query = {};
    if (radius !== undefined) {
      query.location = {
        $near: {
          $maxDistance: radius,
          $geometry: {
            type: 'Point',
            coordinates: [long, latt],
          },
        },
      };
    }

    if (type !== undefined) {
      query.type = type;
    }

    if (date_start !== undefined) {
      const start = date_start;
      let end = start.clone();
      if (date_end !== undefined) {
        end = date_end;
      }
      end.add(1, 'days');

      query.date = {
        $gte: start,
        $lte: end,
      };
    }

    query.deleted = false;

    const result = {};
    const occurences = await Occurrence.find(query).select('-deleted').exec();
    if (occurences) {
      result.result = occurences;
      res.status(200).send(result);
    } else {
      return next(createError(404, 'No occurrences have been found.'));
    }
  } catch (err) {
    next(err);
  }
};

const exclude = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }
  try {
    const result = {};
    const { id } = req.params.id;
    const occurrenceDeleted = await Occurrence.findByIdAndUpdate(id, { deleted: true });
    result.result = occurrenceDeleted;
    result.message = 'Occurence succefully excluded.';
  } catch (err) {
    if (err instanceof errMongo.CastError) {
      return next(createError(404, 'Occurrence couldn\'t be deleted \' cause has not been found.'));
    }
    next(err);
  }
};

const update = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }
};

export { create, getAll, exclude };
