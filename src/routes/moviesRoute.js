import { Router } from "express"
import MoviesCtrl from "../controllers/moviesController"

const router = new Router()

// associate put, delete, and get(id)
router.route("/").get(MoviesCtrl.apiGetMovies)
router.route("/search").get(MoviesCtrl.apiSearchMovies)
router.route("/countries").get(MoviesCtrl.apiGetMoviesByCountry)
router.route("/id/:id").get(MoviesCtrl.apiGetMovieById)



export default router
