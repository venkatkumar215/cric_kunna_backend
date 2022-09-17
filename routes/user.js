import express from "express";

const router =express.Router();

import { signup,singin } from "../controllers/user.js";


router.post("/signin",singin)
router.post("/signup", signup);


export default router;