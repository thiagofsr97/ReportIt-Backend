const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next));
};

export default asyncMiddleware;
