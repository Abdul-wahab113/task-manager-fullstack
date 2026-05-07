import { Router } from "express";
import { registerUser } from "../Controller/user.controller.js";

const routes = Router();

routes.post("/register", registerUser);



export default routes;