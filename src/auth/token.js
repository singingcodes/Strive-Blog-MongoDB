import createHttpError from "http-errors"
import { verifyAccessToken } from "./tools.js"

export const JWTMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "No token provided, Please provide bearer token"))
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "")
      const payload = await verifyAccessToken(token)
      req.user = {
        _id: payload._id,
        role: payload.role,
      }
      next()
    } catch (error) {
      next(createHttpError(401, "Invalid token"))
    }
  }
}
