import { UnauthenticatedError } from '../utils/error/custom.js';
import jwt from 'jsonwebtoken';

/**
 *
 */
const error = (res, code, err) => {
  let message = err.message || err;
  let customCode = code;

  if (message === 'jwt expired') {
    message = 'Please login again';
    customCode = 401;
  }

  const networkError = message.split(' ')[0];
  if (networkError === 'getaddrinfo')
    message = 'Server not connected to internet';

  const duplicateError = message.split(' ')[0];
  if (duplicateError === 'E11000')
    message = 'Document Exist please review your inpute fields';

  return res.status(customCode).json({
    success: 0,
    message: message,
  });
};

const success = (res, statusCode, userData, data) => {
  res.status(statusCode).send({
    success: 1,
    message: 'Successful',
    data,
    userData,
  });
};

// response.js

export const sendResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({
    success: 1,
    message: 'Successful',
    data,
  });
};

// export const payload = (user) => {
//   const token = jwt.sign({ Id: user._id, email: user.email }, JWT_SECRET, {
//     expiresIn: JWTEXPIN,
//     issuer: JWT_ISS,
//   });

//   return { user, token };
// };
export { error, success };
