import * as express from "express"
import Account from "./account/account.router"
import Post from "./post/post.router"
import Comment from "./comment/comment.router"
const router = express.Router()
router.use("/account", Account)
router.use("/post", Post)
router.use("/comment", Comment)
export default router
