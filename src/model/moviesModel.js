import { ObjectId } from "bson"

let movies
const DEFAULT_SORT = [["tomatoes.viewer.numReviews", -1]]

export default class MoviesDAO {
    static async injectDB(conn) {
        if (movies) {
            return
        }
        try {
            movies = await conn.db(process.env.MOVIE_NS).collection("movies")
            this.movies = movies // this is only for testing
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in movies model: ${e}`,
            )
        }
    }


    static async getMoviesByCountry(countries) {

        let cursor
        try {

            cursor = await movies.find(
                { countries: { $in: countries } }).project({ title: 1 })
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return []
        }

        return cursor.toArray()
    }


    static textSearchQuery(text) {
        const query = { $text: { $search: text } }
        const meta_score = { $meta: "textScore" }
        const sort = [["score", meta_score]]
        const project = { score: meta_score }

        return { query, project, sort }
    }


    static castSearchQuery(cast) {
        const searchCast = Array.isArray(cast) ? cast : cast.split(", ")

        const query = { cast: { $in: searchCast } }
        const project = {}
        const sort = DEFAULT_SORT

        return { query, project, sort }
    }


    static genreSearchQuery(genre) {

        const searchGenre = Array.isArray(genre) ? genre : genre.split(", ")

        const query = { genres: { $in: searchGenre } }
        const project = {}
        const sort = DEFAULT_SORT

        return { query, project, sort }
    }

    static async getMovies({

        filters = null,
        page = 0,
        moviesPerPage = 20,
    } = {}) {
        let queryParams = {}

        if (filters) {
            if ("text" in filters) {
                queryParams = this.textSearchQuery(filters["text"])
            } else if ("cast" in filters) {

                queryParams = this.castSearchQuery(filters["cast"])
            } else if ("genre" in filters) {
                queryParams = this.genreSearchQuery(filters["genre"])
            } else if ("country" in filters) {
                queryParams = this.getMoviesByCountry(filters["country"])
            }
        }

        let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams
        let cursor
        try {

            cursor = await movies
                .find(query)
                .project(project)
                .sort(sort)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0 }
        }


        const displayCursor = cursor.limit(moviesPerPage).skip(moviesPerPage * page)

        try {
            const moviesList = await displayCursor.toArray()
            const totalNumMovies = page === 0 ? await movies.countDocuments(query) : 0
            return { moviesList, totalNumMovies }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { moviesList: [], totalNumMovies: 0 }
        }
    }


    static async getMovieByID(id) {
        try {

            const pipeline = [
                {
                    $match: {
                        _id: ObjectId(id)
                    }

                },

                {
                    $lookup:
                    {
                        from: "comments",
                        let: { id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$movie_id", "$$id"] }
                                }
                            },
                            {
                                $sort: { date: -1 }
                            }
                        ],
                        as: "comments"

                    }
                }// end of lookup

            ]

            return await movies.aggregate(pipeline).next()
        } catch (e) {

            if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
                return null
            }
            console.error(`Something went wrong in getMovieByID: ${e}`)
            return null
        }
    }
}



