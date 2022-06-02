import express from "express"
import createError from "http-errors"
import AuthorsModel from "./model.js"

const authorsRouter = express.Router()

// GET /authors
authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find()
    res.send(authors)
  } catch (err) {
    next(err)
  }
})

// GET /authors/:authorId
authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const author = await AuthorsModel.findById(req.params.authorId)
    if (!author) {
      next(createError(404, `Author with id ${req.params.authorId} not found!`))
    }
    res.send(author)
  } catch (err) {
    next(err)
  }
})

// POST /authors
authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body)
    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})
// PUT /authors/:authorId
authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const author = await AuthorsModel.findByIdAndUpdate(
      req.params.authorId,
      req.body,
      { new: true, runValidators: true }
    )
    if (!author) {
      next(createError(404, `Author with id ${req.params.authorId} not found!`))
    }
    res.send(author)
  } catch (err) {
    next(err)
  }
})
// DELETE /authors/:authorId
authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const author = await AuthorsModel.findByIdAndDelete(req.params.authorId)
    if (!author) {
      next(createError(404, `Author with id ${req.params.authorId} not found!`))
    }
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

export default authorsRouter
