import jwt from "jsonwebtoken"
import createHttpError from "http-errors"
import UsersModel from "../services/users/model.js"

// export const authenticateUser = async (user) => {
//   const accessToken = await generateAccessToken({
//     _id: user._id,
//     role: user.role,
//   })
//   const refreshToken = await generateRefreshToken({
//     _id: user._id,
//   })
//   user.refreshToken = refreshToken
//   await user.save()
//   return {
//     accessToken,
//     refreshToken,
//   }
// }
// export const verifyRefreshTokenAndGenerateNewTokens = async (
//   currentRefreshToken
// ) => {
//   try {
//     const payload = await verifyRefreshToken(currentRefreshToken)
//     const user = await UsersModel.findById(payload._id)
//     if (!user) {
//       throw createHttpError(401, "User not found")
//     }
//     if (user.refreshToken && user.refreshToken === currentRefreshToken) {
//       const { accessToken, refreshToken } = await authenticateUser(user)
//       return {
//         accessToken,
//         refreshToken,
//       }
//     } else {
//       throw createHttpError(401, "Invalid refresh token")
//     }
//   } catch (err) {
//     throw createHttpError(401, "Invalid refresh token")
//   }
// }

export const generateAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload.toJSON(),
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  )

export const verifyAccessToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) rej(err)
      else res(payload)
    })
  )
// const generateRefreshToken = (payload) =>
//   new Promise((resolve, reject) =>
//     jwt.sign(
//       payload,
//       process.env.JWT_REFRESH_SECRET,
//       { expiresIn: "1 week" },
//       (err, token) => {
//         if (err) reject(err)
//         else resolve(token)
//       }
//     )
//   )

// const verifyRefreshToken = (token) =>
//   new Promise((res, rej) =>
//     jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
//       if (err) rej(err)
//       else res(payload)
//     })
//   )
