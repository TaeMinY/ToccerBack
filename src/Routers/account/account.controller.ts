import * as bcrypt from "bcrypt-nodejs"
import { Request, Response } from "express"
import User from "../../Model/account"
import Send from "../../Module/Send"
import * as nodemailer from "nodemailer"
import * as path from "path"
import * as jwt from "jsonwebtoken"
import * as shortid from "shortid"
const idRule = /^.*(?=^.{4,15}$)(?=.*\d)(?=.*[a-zA-Z]).*$/
const passwordRule = /^.*(?=^.{6,15}$)(?=.*\d)(?=.*[a-zA-Z]).*$/
const emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
require("dotenv").config()

export const Signup = async (req: Request, res: Response) => {
  const { id, pwd, pwd2, username, email, profile__expansion, terms } = req.body
  if (terms == false) {
    return Send(res, 200, "약관을 동의해주세요.", false)
  }
  if (!id || !pwd || !pwd2 || !username || !email) {
    return Send(res, 200, "빈칸을 모두 입력해 주세요.", false)
  }
  if (!idRule.test(id)) {
    return Send(res, 200, "아이디는 영문과 숫자를 포함하여 4~15자리로 입력해주세요.", false)
  }
  if (!(2 <= username.length || username.length <= 12)) {
    return Send(res, 200, "닉네임은 4~12자리로 입력해주세요.", false)
  }
  if (!emailRule.test(email)) {
    return Send(res, 200, "올바른 이메일 형식이 아닙니다.", false)
  }
  if (!passwordRule.test(pwd)) {
    return Send(res, 200, "비밀번호는 영문과 숫자를 포함하여 6~15자리로 입력해주세요.", false)
  }
  if (pwd != pwd2) {
    return Send(res, 200, "비밀번호가 일치하지 않습니다.", false)
  }

  User.findOne({ id: id }, async function(err, result) {
    if (err) throw err
    if (result == null) {
      User.findOne({ email: email }, async function(err, result) {
        if (result == null) {
          bcrypt.hash(pwd, null, null, async function(err, hash) {
            const random = await shortid.generate()
            const user: any = new User({
              id: id,
              password: hash,
              username: username,
              email: email,
              profile: random + "." + profile__expansion,
              admin: false
            })
            await user
              .save()
              .then(data => {
                return res
                  .status(200)
                  .send({ state: true, result: "회원가입이 되셨습니다.", profileText: random })
                  .end()
              })
              .catch(err => Send(res, 200, "DB 저장을 실패했습니다.", false))
          })
        } else {
          return Send(res, 200, "이미 존재하는 이메일입니다.", false)
        }
      })
    } else {
      return Send(res, 200, "이미 존재하는 아이디입니다.", false)
    }
  })
}
export const Signin = (req: Request, res: Response) => {
  const { id, pwd } = req.body
  if (!id || !pwd) {
    return Send(res, 200, "빈칸을 모두 입력해 주세요.", false)
  }
  User.findOne({ id: id }, function(err, result) {
    if (err) throw err
    if (result != null) {
      // 만약 계정이 있을 때
      bcrypt.compare(pwd, result.password, function(err, value) {
        if (value == true) {
          //비밀번호O
          let token = jwt.sign(
            {
              id: result.id
            },
            process.env.jwtpassword,
            {
              expiresIn: 44640
            }
          )
          return res
            .status(200)
            .send({ state: true, result: "로그인이 되셨습니다.", token: token })
            .end()
        } else {
          Send(res, 200, "비밀번호가 일치하지 않습니다.", false)
        }
      })
    } else {
      Send(res, 200, "아이디가 존재하지 않습니다.", false)
    }
  })
}
export const Token = (req: Request, res: Response) => {
  const { token } = req.body
  console.log(token)
  if (!token) {
    return Send(res, 200, "인증실패.", false)
  }
  let decoded = jwt.verify(token, process.env.jwtpassword)
  User.findOne({ id: decoded.id }, function(err, result) {
    if (result) {
      if (result.admin == true) {
        return res.status(200).send({ result: "인증성공", state: true, admin: true, data: result })
      } else {
        return res.status(200).send({ result: "인증성공", state: true, data: result })
      }
    } else {
      return Send(res, 200, "인증실패.", false)
    }
  })
}
