const getOrigin = (requestOrigin, callback) => {
  const allowedOrigin =
    !requestOrigin ||
    ['localhost'].some((value) => requestOrigin.includes(value));
  if (allowedOrigin) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

// console.log(getOrigin)

export const corsOptions = {
  credentials: true,
  origin: getOrigin,
};
