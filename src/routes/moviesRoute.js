import { Router } from "express"
import MoviesCtrl from "../controllers/moviesController"
import CommentsCtrl from "../controllers/commentsController"


const router = new Router()

router.route("/").get(MoviesCtrl.apiGetMovies)
router.route("/search").get(MoviesCtrl.apiSearchMovies)
router.route("/countries").get(MoviesCtrl.apiGetMoviesByCountry)
router.route("/id/:id").get(MoviesCtrl.apiGetMovieById)

router
    .route("/comment")
    .post(CommentsCtrl.apiPostComment)
    .put(CommentsCtrl.apiUpdateComment)
    .delete(CommentsCtrl.apiDeleteComment)

export default router
