import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import users from './routes/usersRoute'
import movies from './routes/moviesRoute'


const app = express()

app.use(cors())
process.env.NODE_ENV !== "prod" && app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Register api routes
app.use("/api/v1/private/user", users)
app.use("/api/v1/private/movies", movies)

app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app
