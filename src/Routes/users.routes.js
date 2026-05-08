import { Router } from "express";
import { registerUser, loginUser } from "../Controller/user.controller.js";

const routes = Router();

routes.post("/register", registerUser);
routes.post("/login", loginUser);


export default routes;