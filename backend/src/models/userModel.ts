import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Location, IUser } from "../types/userType";

const locationSchema = new Schema<Location>({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
    // required: true,
  },
  coordinates: {
    type: [Number],
    // required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    location: {
      type: [locationSchema],
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    interests: {
      type: [String],
    },
    profilePic: {
      type: String,
    },
    friendRequests: [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      }
    ],
    sendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    friends:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
