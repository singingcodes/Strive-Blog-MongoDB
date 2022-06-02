import mongoose from "mongoose"

const { Schema, model } = mongoose

const blogSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    readTime: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    content: {
      type: String,
      required: true,
    },
    comments: [{ text: String, rate: Number }],
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ userId: String }],
  },
  {
    timestamps: true,
  }
)

// *********************************************************** CUSTOM METHOD *******************************************************
// we are going to attach a custom functionality (a method) to the schema --> everywhere we gonna import the model we gonna have the method available
blogSchema.static("findBlogsWithAuthors", async function (query) {
  const total = await this.countDocuments(query.criteria)
  const blogs = await this.find(query.criteria, query.options.fields)
    .sort(query.options.sort)
    .skip(query.options.skip || 0)
    .limit(query.options.limit || 5)
    .populate({ path: "authors", select: "name avatar" })
  return { blogs, total }
})

export default model("Blog", blogSchema)
