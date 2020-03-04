import * as express from "express"
import { Create, FindAll } from "./post.controller"
const router = express.Router()

router.post("/create", Create)
router.post("/findall", FindAll)
export default router
