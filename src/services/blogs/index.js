import express from "express"
import createError from "http-errors"
import BlogsModel from "./model.js"

import q2m from "query-to-mongo"

const blogRouter = express.Router()

// GET /blogs
blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogsModel.find().populate({
      path: "authors",
      select: "name avatar",
    })
    res.send(blogs)
  } catch (err) {
    next(err)
  }
})
// GET /blogs/:blogId
blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId).populate({
      path: "authors",
      select: "name avatar",
    })
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

// GET /blogs/:blogId/comments
blogRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId, {
      comments: 1,
      _id: 0,
    })
    if (!blog) {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`))
    }
    res.send(blog.comments)
  } catch (err) {
    next(err)
  }
})

// POST /blogs/:blogId/comments
blogRouter.post("/:blogId/comments", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId, { _id: 0 })
    if (blog) {
      const commentToAdd = {
        ...blog.toObject(),
        commentDate: new Date(),
        ...req.body,
      }
      const updatedBlog = await BlogsModel.findByIdAndUpdate(
        req.params.blogId,
        { $push: { comments: commentToAdd } },
        { new: true, runValidators: true }
      )
      if (updatedBlog) {
        res.send(updatedBlog.comments)
      } else {
        next(createError(404, `Blog with id ${req.params.blogId} not found!`))
      }
    } else {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
// GET /blogs/:blogId/comments/:commentId
blogRouter.get("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId)
    if (blog) {
      const comment = blog.comments.find(
        (comment) => comment._id.toString() === req.params.commentId
      )
      if (comment) {
        res.send(comment)
      } else {
        next(
          createError(404, `Comment with id ${req.params.commentId} not found!`)
        )
      }
    } else {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (err) {
    next(err)
  }
})

// PUT /blogs/:blogId/comments/:commentId
blogRouter.put("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId)
    if (blog) {
      const index = blog.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      )
      if (index !== -1) {
        blog.comments[index] = {
          ...blog.comments[index].toString(),
          ...req.body,
        }
        await blog.save()
        res.send(blog)
      } else {
        next(
          createError(404, `Comment with id ${req.params.commentId} not found!`)
        )
      }
    } else {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {}
})

// DELETE /blogs/:blogId/comments/:commentId
blogRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findByIdAndUpdate(
      req.params.blogId,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    )
    if (!blog) {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`))
    }
    res.status(204).send()
  } catch (error) {}
})

// POST /blogs/:blogId/likes
// Add a like to a blog by a user
blogRouter.post("/:blogId/likes", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId)
    if (blog) {
      const likeToAdd = {
        ...blog.toObject(),
        likeDate: new Date(),
        ...req.body,
      }
      const updatedBlog = await BlogsModel.findByIdAndUpdate(
        req.params.blogId,
        { $push: { likes: likeToAdd } },
        { new: true, runValidators: true }
      )
      if (updatedBlog) {
        res.send(updatedBlog.likes)
      } else {
        next(createError(404, `Blog with id ${req.params.blogId} not found!`))
      }
    } else {
      next(createError(404, `Blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default blogRouter
