import * as express from "express"
import { Create, FindAll, Init } from "./post.controller"
const router = express.Router()

router.post("/create", Create)
router.post("/findall", FindAll)
router.get("/init", Init)
export default router
