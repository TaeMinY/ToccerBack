import { model, Schema, Model, Document } from "mongoose"
const userSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    required: true
  }
})
export interface UserDocument extends Document {
  id: string
  password: string
  username: string
  email: string
  profile: string
}
const User: Model<UserDocument> = model("user", userSchema)
export default User
