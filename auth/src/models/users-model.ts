/**
 * Node Core Modules
 */
import moment from 'moment';
import mongoose from 'mongoose';

import { PasswordService } from '@/services/password-service';

// An interface that describes the properties that are requried to create a new User
export interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a User Model has
interface UserModelInterface extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

// An interface that describes the properties that a User Document has
export interface UserDocument extends mongoose.Document {
  id?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  address?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      index: true,
      unique: true,
      dropDups: true,
      lowercase: true,
      // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, "Password can't be empty"],
      minlength: [4, 'Password must be at list 6 character long'],
      maxlength: [20, 'Password can not be more than 20 characters'],
      select: false,
    },
    address: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters'],
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

// Document Middleware: runs before .save() and .create().
// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  const hashed = await PasswordService.toHash(this.get('password'));
  this.set('password', hashed);
  next();
});

// Virtual for author's full name / name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('createDate').get(function () {
  return this.createdAt
    ? moment(this.get('createdAt')).format('YYYY-MM-DD')
    : '';
});

UserSchema.virtual('updateDate').get(function () {
  return this.updatedAt
    ? moment(this.get('updatedAt')).format('YYYY-MM-DD')
    : '';
});

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new UserModel(attrs);
};

const UserModel = mongoose.model<UserDocument, UserModelInterface>(
  'User',
  UserSchema
);

export default UserModel;
