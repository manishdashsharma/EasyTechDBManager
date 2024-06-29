import { Router } from "express";
import {
  createUser
} from "../controllers/auth.conroller.js";

const router = Router();

router.post("/", createUser);

export default router;
