import express from "express"
import createError from "http-errors"
import BlogsModel from "./model.js"

const blogRouter = express.Router()

// GET /blogs
blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogsModel.find()
    res.send(blogs)
  } catch (err) {
    next(err)
  }
})
// GET /blogs/:blogId
blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId)
    if (!blog) {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`))
    }
    res.send(blog)
  } catch (err) {
    next(err)
  }
})

// POST /blogs
blogRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogsModel(req.body)
    const { _id } = await newBlog.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})
// PUT /blogs/:blogId
blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findByIdAndUpdate(
      req.params.blogId,
      req.body,
      { new: true, runValidators: true }
    )
    if (!blog) {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`))
    }
    res.send(blog)
  } catch (err) {
    next(err)
  }
})

// DELETE /blogs/:blogId
blogRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findByIdAndDelete(req.params.blogId)
    if (!blog) {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`))
    }
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

export default blogRouter
