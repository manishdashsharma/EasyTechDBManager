import { Router } from "express";
import {
  healthCheckService
} from "../controllers/healthcheck.controller.js";

const router = Router();

router.get("/", healthCheckService);

export default router;
