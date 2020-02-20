import * as express from "express"
import { Signin, Signup, Token } from "./account.controller"
import { Request, Response } from "express"

import * as path from "path"
import * as multer from "multer"
const router = express.Router()

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "upload/")
    },
    filename: function(req, file, cb) {
      cb(null, req.body.name)
      //path.extname(file.originalname)
    }
  })
})

router.post("/signin", Signin)
router.get("/token", Token)

router.post("/signup", Signup)

router.post("/profile", upload.single("image"), (req: Request, res: Response) => {
  //안되면 bin
  res
    .status(200)
    .send({ result: true, mes: "저장성공" })
    .end()
})

export default router
