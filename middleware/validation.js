import Joi from "joi";

// Generic validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  };
};

// Login validation schema
export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(3).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 3 characters long',
    'any.required': 'Password is required'
  })
});

// Password update validation schema
export const passwordUpdateSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Confirm password is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  })
});

// Admin creation validation schema
export const adminCreateSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  department: Joi.string().required().messages({
    'any.required': 'Department is required'
  }),
  dob: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
    'string.pattern.base': 'Date of birth must be in YYYY-MM-DD format',
    'any.required': 'Date of birth is required'
  }),
  contactNumber: Joi.string().pattern(/^\d{10}$/).required().messages({
    'string.pattern.base': 'Contact number must be 10 digits',
    'any.required': 'Contact number is required'
  }),
  joiningYear: Joi.string().pattern(/^\d{4}$/).required().messages({
    'string.pattern.base': 'Joining year must be a 4-digit year',
    'any.required': 'Joining year is required'
  }),
  avatar: Joi.string().uri().optional()
});

// Student creation validation schema
export const studentCreateSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  department: Joi.string().required(),
  dob: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  contactNumber: Joi.string().pattern(/^\d{10}$/).required(),
  section: Joi.string().required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  batch: Joi.string().required(),
  year: Joi.string().required(),
  fatherName: Joi.string().min(2).max(50).required(),
  motherName: Joi.string().min(2).max(50).required(),
  fatherContactNumber: Joi.string().pattern(/^\d{10}$/).required(),
  motherContactNumber: Joi.string().pattern(/^\d{10}$/).required(),
  avatar: Joi.string().uri().optional()
});

// Faculty creation validation schema
export const facultyCreateSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  department: Joi.string().required(),
  dob: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  contactNumber: Joi.string().pattern(/^\d{10}$/).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  designation: Joi.string().required(),
  joiningYear: Joi.string().pattern(/^\d{4}$/).required(),
  avatar: Joi.string().uri().optional()
});

// Department creation validation schema
export const departmentCreateSchema = Joi.object({
  department: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Department name must be at least 2 characters long',
    'string.max': 'Department name cannot exceed 100 characters',
    'any.required': 'Department name is required'
  })
});

// Subject creation validation schema
export const subjectCreateSchema = Joi.object({
  subjectName: Joi.string().min(2).max(100).required(),
  subjectCode: Joi.string().min(2).max(20).required(),
  department: Joi.string().required(),
  year: Joi.string().required(),
  totalLectures: Joi.number().integer().min(1).required().messages({
    'number.min': 'Total lectures must be at least 1',
    'any.required': 'Total lectures is required'
  })
});

// Notice creation validation schema
export const noticeCreateSchema = Joi.object({
  topic: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(10).max(2000).required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  noticeFor: Joi.string().valid('All', 'Student', 'Faculty').required(),
  from: Joi.string().required()
});
