import app from "./server"
import { MongoClient } from "mongodb"
import color from "colors"
import UsersDAO from './model/usersModel'


const port = process.env.PORT || 8080

MongoClient.connect(
    process.env.MOVIE_URI,
    {
        maxPoolSize: 50,
        waitQueueTimeoutMS: 2500

    },
    { useNewUrlParser: true },
    { useUnifiedTopology: true }

)
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await UsersDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`server running at: http://127.0.0.1:${port}/api/v1/private/`.underline.cyan)
        })
    })
