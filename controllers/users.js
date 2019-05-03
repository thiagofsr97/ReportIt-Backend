import { validationResult } from 'express-validator/check';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
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

    console.log(user);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const payload = {
        user: user.username,
        id: user._id,
      };
      const token = await signIn(payload);

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

    // if (req.file !== undefined) {
    //   console.log(req.file);
    //   user.set('profile.file', req.file.path);
    // }

    if (req.file !== undefined) {
      user.picture = {};
      user.picture.url = req.file.url;
      user.picture.id = req.file.public_id;
    }

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
    const { id } = req.params;
    const updateObj = {};

    const user = await User.findById(id);
    if (!user) {
      return next(createError(404, 'User not found.'));
    }


    Object.keys(user._doc).forEach((key) => {
      if (key !== '_id' && req.body[key] !== undefined) {
        updateObj[key] = req.body[key];
      }
    });
    if (updateObj.dateBirth !== undefined) {
      updateObj.dateBirth = new Date(updateObj.dateBirth);
    }

    const { username } = updateObj;
    if (username !== undefined) {
      const exists = await User.findOne({ username });

      if (exists && (exists._id !== id)) {
        return next(createError(403, `Username ${username} has already been taken.`));
      }
    }

    Object.assign(user, updateObj);
    const userSaved = await user.save();
    destroyJwt(id);
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
