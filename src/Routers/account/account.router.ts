import * as express from "express"
import { Signin, Signup, Token } from "./account.controller"
import { Request, Response } from "express"

import * as multer from "multer"
const router = express.Router()

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "profile_image/")
    },
    filename: function(req, file, cb) {
      console.log(req.body.name)
      cb(null, req.body.name + "." + req.body.ex)
    }
  })
})

router.get("/token", Token)
router.post("/signin", Signin)
router.post("/signup", Signup)
router.post("/profile", upload.single("bin"), (req: Request, res: Response) => {
  res
    .status(200)
    .send({ state: true, result: "저장성공" })
    .end()
})

export default router
