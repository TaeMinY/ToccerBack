import * as express from "express"
import { Create } from "./post.controller"
const router = express.Router()

router.post("/create", Create)

export default router
