import * as bcrypt from "bcrypt-nodejs"
import { Request, Response } from "express"
import Post from "../../Model/post"
import User from "../../Model/account"
import * as moment from "moment"
import Send from "../../Module/Send"
import * as jwt from "jsonwebtoken"

require("dotenv").config()

export const Create = async (req: Request, res: Response) => {
  const { title, text, token } = req.body
  if (!title || !text) {
    return Send(res, 200, "빈칸을 모두 입력해 주세요.", false)
  }
  let decoded = jwt.verify(token, process.env.jwtpassword)

  User.findOne({ id: decoded.id }, async function(err, result) {
    if (result != null) {
      const user: any = new Post({
        title: title,
        text: text,
        time: moment().format("YYYY-MM-DD-HH-mm-ss"),
        username: result.username,
        userId: result.id
      })
      await user
        .save()
        .then(data => {
          return res
            .status(200)
            .send({ state: true, result: "게시물을 정상적으로 작성하였습니다." })
            .end()
        })
        .catch(err => Send(res, 200, "DB 저장을 실패했습니다.", false))
    } else {
      return Send(res, 200, "게시물을 작성하지 못하였습니다.", false)
    }
  })
}
