/**
 *
 * @param {*} fn
 * @returns
 */
const asyncWrapper = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (e) {
    next(e);
  }
};

export default asyncWrapper;
