import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import blogRouter from "./services/blogs/index.js"
import authorRouter from "./services/authors/index.js"
import userRouter from "./services/users/index.js"
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001

// Middleware
server.use(cors())
server.use(express.json())

// Routes
server.use("/blogs", blogRouter)
server.use("/authors", authorRouter)
server.use("/users", userRouter)
//error handling
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)
// Start server
mongoose.connect(process.env.MONGO_CONNECTION_URL)
mongoose.connection.on("connected", () => {
  console.log("Successfully Connected to MongoDB")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server listening on port ${port}`)
  })
})
