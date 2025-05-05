const Joi = require('joi');

const userRequestSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(120).required(),
  password: Joi.string()
    .min(6)
    .regex(/^(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
    }),
});

// Validation middleware
const validateUserRequest = (req, res, next) => {
  const { error } = userRequestSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = {validateUserRequest};