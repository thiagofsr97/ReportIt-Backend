import { validationResult } from 'express-validator';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';


const authenticate = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }

  try {
    const { username, password } = req.body;
    const result = {};

    const user = await User.findOne({ username }).select('-password').exec();
    if (!user) {
      return next(createError(404), 'User not found.');
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const payload = { user: user.name };
      const options = { expiresIn: '1d' };
      const secret = process.env.SECRET;
      const token = jwt.sign(payload, secret, options);

      result.token = token;
      result.result = user;
      res.status(200).send(result);
    } else {
      return next(createError(401, 'Authentication Error.'));
    }
  } catch (err) {
    next(err);
  }
};

const getAll = async function (req, res, next) {
  try {
    const result = {};
    const users = await User.find({}).select('-password').exec();
    if (users) {
      result.result = users;
      res.status(200).send(result);
    } else {
      return next(createError(404, 'Users not found.'));
    }
  } catch (err) {
    next(err);
  }
};

const getById = async function (req, res, next) {
  try {
    const { id } = req.params;
    const result = {};
    const user = await User.findById(id).select('-password').exec();
    if (user) {
      result.result = user;
      res.status(200).send(result);
    } else {
      return next(createError(404, 'User not found.'));
    }
  } catch (err) {
    next(err);
  }
};

const create = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }

  try {
    const result = {};
    const {
      name, username, password, registrationNumber, dateBirth,
    } = req.body;
    if (await User.findOne({ username })) {
      return next(createError(403, `Username ${username} has already been taken.`));
    }

    const user = new User({
      name,
      username,
      password,
      dateBirth: new Date(dateBirth),
      registrationNumber,
    });

    const userCreated = await user.save();
    result.result = userCreated;
    res.status(200).send({ result });
  } catch (err) {
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
    const { id } = req.params.id;
    const updateObj = {};

    const user = await User.findById(id);
    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    Object.keys(user).forEach((key) => {
      if (key !== '_id' && req.body[key] !== undefined) {
        updateObj[key] = req.body[key];
      }
    });
    if (updateObj.dateBirth !== undefined) {
        updateObj.dateBirth = new Date(updateObj.dateBirth);
    }

    Object.assign(user, updateObj);
    const userSaved = await user.save();
    result.result = userSaved;
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const exclude = async function (req, res, next) {
  try {
    const result = {};
    const { id } = req.params;
    const userDeleted = await User.findByIdAndRemove(id);
    result.result = userDeleted;
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export {
  authenticate, getAll, getById, create, update, exclude,
};
