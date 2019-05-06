import { validationResult } from 'express-validator/check';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { Error as errMongo } from 'mongoose';
import { validateToken, destroyJwt, signIn } from '../helpers/jwtAuth';
import User from '../models/user';


const authenticate = async function (req, res, next) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return next(createError(422, validation.array()));
  }

  try {
    const { username, password } = req.body;
    const result = {};

    const user = await User.findOne({ username });
    if (!user) {
      return next(createError(404), 'User not found.');
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const payload = {
        user: user.username,
        id: user._id,
      };
      const token = await signIn(payload);

      result.token = token;
      result.result = user;
      result.message = 'User has been successfully authenticated.';
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
    const users = await User.find({ deleted: false }).select('-password').exec();
    if (users) {
      result.result = users;
      result.message = 'Users have been successfully found.';
      res.status(200).send(result);
    } else {
      return next(createError(404, 'There are not users in the DB.'));
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
    if (err instanceof errMongo.CastError) {
      return next(createError(404, 'User not found \'cause id is not processable.'));
    }
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
      dateBirth,
      registrationNumber,
      ...(req.file && { folder: req.file.public_id.substring(0, req.file.public_id.lastIndexOf('/')) }),
    });


    if (req.file) {
      const { url, public_id, secure_url } = req.file;
      user.picture = {
        url,
        id: public_id,
        secureUrl: secure_url,
      };
    }


    const userCreated = await user.save();
    result.result = userCreated;
    res.status(200).send(result);
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
    const { id } = req.params;


    const user = await User.findById(id);
    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    const {
      name, username, password, dateBirth, registrationNumber,
    } = req.body;
    if (username) {
      const exists = await User.findOne({ username });

      if (exists && (exists._id !== id)) {
        return next(createError(403, `Username ${username} has already been taken.`));
      }
    }

    const args = {
      ...(name && { name }),
      ...(username && { username }),
      ...(password && { password }),
      ...(dateBirth && { dateBirth }),
      ...(registrationNumber && { registrationNumber }),
      ...((req.file && !user.folder) && { folder: req.file.public_id.substring(0, req.file.public_id.lastIndexOf('/')) }),
    };

    Object.assign(user, args);

    if (req.file) {
      const { url, public_id, secure_url } = req.file;
      user.picture = {
        url,
        id: public_id,
        secureUrl: secure_url,
      };
    }

    const userSaved = await user.save();
    result.result = userSaved;
    result.message = 'User has been successfully updated.';
    res.status(200).send(result);
  } catch (err) {
    if (err instanceof errMongo.CastError) {
      return next(createError(404, 'User not updated \'cause id is not processable.'));
    }
    next(err);
  }
};

const exclude = async function (req, res, next) {
  try {
    const result = {};
    const { id } = req.params;
    const userDeleted = await User.findByIdAndUpdate(id, { deleted: true });
    result.result = userDeleted;
    result.message = 'User has been deleted sucessfully.';
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const logout = async function (req, res, next) {
  try {
    const result = {};
    const { id } = req.params;
    await destroyJwt(id);
    result.id = id;
    result.result = `User of id ${id} has succefully been logged out.`;
    res.status(200).send(result);
  } catch (err) {
    return next(createError(403, `Error logging out user of id ${id}. Might have already been logged out before or doesn't exit.`));
  }
};

const deleteAll = async function (req, res, next) {
  try {
    const result = {};
    await User.deleteMany({});
    result.result = 'All users have been deleted from Database. Wow, you\'re crazy!';
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export {
  authenticate, getAll, getById, create, update, exclude, logout, deleteAll,
};
