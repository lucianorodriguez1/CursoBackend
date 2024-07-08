import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    minLength: 3,
    required: true,
  },
  last_name: {
    type: String,
    minLength: 3,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
    required: true,
  },
  email: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 4,
    required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
    required: true,
  },
  profilePhoto: {
    name: {
      type: String,
      default: null, 
    },
    reference: {
      type: String,
      default: null, 
    },
  },
  documents: {
    type: [
      {
        name: {
          type: String,
          default:'name',
        },
        reference: {
          type: String,
          default:'reference',
        },
      },
    ],
    default: [],
  },
  last_connection:{
    type:Date, 
    default:null,
  },
  isOnline:{
    type: Boolean,
    default:false
  }
});

userSchema.pre("find", function () {
  this.populate("cartId");
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
