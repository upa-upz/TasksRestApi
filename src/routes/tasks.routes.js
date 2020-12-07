import { Router } from "express";

import * as taskController from "../controllers/task.controller";

const router = Router();

router.post("/", taskController.createTask);

router.get("/", taskController.findAllTask);

router.get("/done", taskController.findAllDoneTasks);

router.get("/:id", taskController.findOneTask);

router.delete("/:id", taskController.deleteTask);

router.put("/:id", taskController.updateTask);

export default router;
