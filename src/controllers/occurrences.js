import { validationResult } from 'express-validator/check';
import createError from 'http-errors';
import { Error as errMongo } from 'mongoose';
import Occurrence from '../models/occurrence';

const create = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }

  try {
    const {
      description, date, type, location, itemsLost, id,
    } = req.body;
    const occurrence = new Occurrence({
      description,
      date,
      type,
      itemsLost,
      location,
      createdBy: id,
    });

    if (req.files) {
      let assigned = false;
      const { itemsPics, locationPics } = req.files;

      if (itemsPics) {
        occurrence.itemsPics = [];
        itemsPics.forEach((picture) => {
          const { url, secure_url, public_id } = picture;
          if (!assigned) {
            occurrence.folder = picture.destination;
            assigned = true;
          }
          occurrence.itemsPics.push({
            url,
            secureUrl: secure_url,
            id: public_id,
          });
        });
      }

      if (locationPics) {
        occurrence.locationPics = [];
        locationPics.forEach((picture) => {
          const { url, secure_url, public_id } = picture;
          if (!assigned) {
            occurrence.folder = picture.destination;
            assigned = true;
          }
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

const getById = async function (req, res, next) {
  try {
    const result = {};
    const { id } = req.params;
    const occurrence = await Occurrence.findById(id).select('-deleted').exec();
    if (occurrence) {
      result.result = occurrence;
      result.message = 'Occurrence has been successfully found.';
    } else {
      return next(createError(404, 'Occurrence not found.'));
    }
    res.status(200).send(result);
  } catch (err) {
    if (err instanceof errMongo.CastError) {
      return next(createError(404, 'Occurrence couldn\'t be found \'cause id is not processable.'));
    }
    next(err);
  }
};

const getByUserId = async function (req, res, next) {
  try {
    const { id } = req.params;
    const occurrences = await Occurrence.find({ createdBy: id, deleted: false }).select('-deleted').exec();
    if (!occurrences) {
      return next(createError(404, 'Occurrences not found.'));
    }
    const result = {};
    result.result = occurrences;
    result.message = 'Occurrences have been sucessfully found.';
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

    let dateQuery;
    if (date_start) {
      const start = date_start;
      let end = start.clone();
      if (date_end) {
        end = date_end;
      }
      end.add(1, 'days');

      dateQuery = {
        date: {
          $gte: start,
          $lte: end,
        },
      };
    }
    const query = {
      ...((radius && long && latt) && {
        location: {
          $near: {
            $maxDistance: radius,
            $geometry: {
              type: 'Point',
              coordinates: [long, latt],
            },
          },
        },
      }),
      ...(type && { type }),
      ...(dateQuery && { dateQuery }),
      deleted: false,
    };

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

  try {
    const result = {};
    const { id } = req.params;

    const occurrence = await Occurrence.findById(id);

    if (!occurrence) {
      return next(createError(404, 'Occurrence not updated \'cause was not found with this id.'));
    }
    const {
      description, date, type, location, itemsLost,
    } = req.body;

    const args = {
      ...(description && { description }),
      ...(date && { date }),
      ...(type && { type }),
      ...(location && { location }),
      ...(itemsLost && { itemsLost }),
    };

    Object.assign(occurrence, args);

    if (req.files) {
      const { itemsPics, locationPics } = req.files;
      let assigned = false;

      if (itemsPics) {
        occurrence.itemsPics = [];
        itemsPics.forEach((picture) => {
          const { url, secure_url, public_id } = picture;
          if (!assigned) {
            occurrence.folder = picture.destination;
            assigned = true;
          }
          occurrence.itemsPics.push({
            url,
            secureUrl: secure_url,
            id: public_id,
          });
        });
      }

      if (locationPics) {
        occurrence.locationPics = [];
        locationPics.forEach((picture) => {
          const { url, secure_url, public_id } = picture;
          if (!assigned) {
            occurrence.folder = picture.destination;
            assigned = true;
          }
          occurrence.locationPics.push({
            url,
            secureUrl: secure_url,
            id: public_id,
          });
        });
      }
    }

    const occurrenceSaved = await occurrence.save();
    result.result = occurrenceSaved;
    result.message = 'Occurrence has been succefully updated.';
    res.status(200).send(result);
  } catch (err) {
    if (err instanceof errMongo.CastError) {
      return next(createError(404, 'Occurrence couldn\'t be updated\' cause id is not processable.'));
    }
    next(err);
  }
};

export {
  create, getAll, exclude, update, getById, getByUserId,
};
