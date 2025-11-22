// Example middleware
module.exports = (req, res, next) => {
  console.log('Auth middleware running');
  next();
};
