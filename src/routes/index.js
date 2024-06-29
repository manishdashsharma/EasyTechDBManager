import { Router } from "express";
import healtcheckRoutes from './healthcheck.route.js'
import authRoutes from './auth.route.js'
import dbRoutes from './db.route.js'

 
const router = Router()


router.use("/healtcheckup", healtcheckRoutes)
router.use("/auth", authRoutes)
router.use("/db", dbRoutes)

export default router