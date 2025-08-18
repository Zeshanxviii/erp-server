import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,  // This creates an index automatically
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    username: {
      type: String,
      required: true,
      unique: true,  // This creates an index automatically
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    dob: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
    },
    joiningYear: {
      type: String,
      required: true,
      match: [/^\d{4}$/, 'Joining year must be a 4-digit year']
    },
    avatar: {
      type: String,
      default: null
    },
    contactNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Contact number must be 10 digits']
    },
    passwordUpdated: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  { 
    timestamps: true,
    strict: true
  }
);

// Index for better query performance (email and username are already indexed by unique: true)
adminSchema.index({ department: 1 });

export default mongoose.model("admin", adminSchema);
