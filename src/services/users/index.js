import express from "express"
import userModel from "./model.js"
import passport from "passport"
import createError from "http-errors"
import { basicAuth } from "../../auth/basic.js"
import { generateAccessToken } from "../../auth/tools.js"
import { JWTMiddleware } from "../../auth/token.js"

const userRouter = express.Router()

//redirect to google login
userRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
)
//redirect to google callback
userRouter.get(
  "/googleRedirect",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res, next) => {
    try {
      const { token } = req.user // passportNext is adding accessToken and refreshToken to req.user
      console.log("TOKEN", token)
      // res.send({ accessToken, refreshToken })
      res.redirect(`${process.env.FE_URL}/home/${token}`)
    } catch (error) {
      next(createError(401, "Invalid token"))
    }
  }
)

// GET /users
userRouter.get("/", async (req, res, next) => {
  try {
    const users = await userModel.find()
    res.send(users)
  } catch (err) {
    next(err)
  }
})

// GET /users/:userId
userRouter.get("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.userId)
    if (!user) {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
    res.send(user)
  } catch (err) {
    next(err)
  }
})

// POST /users
userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new userModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})
// PUT /users/:userId
userRouter.put("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    )
    if (!user) {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
    res.send(user)
  } catch (err) {
    next(err)
  }
})
// DELETE /users/:userId
userRouter.delete("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.userId)
    if (!user) {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

//register a new user with username and password
userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new userModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})

//login a user with username and password
userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await userModel.checkCredentials(email, password)
    if (!user) {
      next(createError(401, "Invalid credentials"))
    } else {
      const accessToken = await generateAccessToken({
        _id: user._id,
        role: user.role,
      })
      res.send({ accessToken })
    }
  } catch (err) {
    next(err)
  }
})
// userRouter.post("/refreshToken", async (req, res, next) => {
//   try {
//     const { currentRefreshToken } = req.body
//     const { accessToken, refreshToken } =
//       await verifyRefreshTokenAndGenerateNewTokens(currentRefreshToken)
//     res.send({ accessToken, refreshToken })
//   } catch (err) {
//     next(err)
//   }
// })
export default userRouter
