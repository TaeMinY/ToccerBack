import * as express from "express"
import { Create } from "./comment.controller"
import { Request, Response } from "express"

const router = express.Router()

router.post("/create", Create)

export default router
