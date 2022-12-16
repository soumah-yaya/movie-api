import { Router } from "express"
import usersCtrl from "../controllers/usersController"

const router = new Router()
console.log('route')
// associate put, delete, and get(id)
router.route("/register").post(usersCtrl.register)
router.route("/login").post(usersCtrl.login)
router.route("/logout").post(usersCtrl.logout)
router.route("/delete").delete(usersCtrl.delete)
router.route("/update-preferences").put(usersCtrl.save)
router.route("/make-admin").post(usersCtrl.createAdminUser)
export default router
