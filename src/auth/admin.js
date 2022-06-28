import createHttpError from "http-errors"

export const adminOnlyAuth = async (req, res, next) => {
  if (req.user.role === "admin") {
    next()
  } else {
    next(createHttpError(401, "You are not authorized to perform this action"))
  }
}
