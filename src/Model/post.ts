import { model, Schema, Model, Document } from "mongoose"
const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  userId:{
      type:String,
      required:true
  }
})
export interface PostDocument extends Document {
  data: any
  text: string
  like: any
  like_users: any
  time: string
  email: string
  name: string
}
const Post: Model<PostDocument> = model("post", postSchema)
export default Post
