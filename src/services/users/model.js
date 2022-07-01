import mongoose from "mongoose"
import bcrypt from "bcrypt"
const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    email: {
      type: String,
      required: true,
    },
    refreshToken: { type: String },
    googleID: { type: String },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 11)
  }
  next()
})
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.__v
  return user
}
userSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const isValid = await bcrypt.compare(password, user.password)
    if (isValid) {
      return user
    } else {
      return null
    }
  }
  return null
})

export default model("User", userSchema)
