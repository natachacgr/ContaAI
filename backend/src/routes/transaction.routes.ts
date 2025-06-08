import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";

const router = Router();
const controller = new TransactionController();

// Rotas CRUD completas para transações
router.post("/", controller.create); // POST /api/accounting-entries
router.get("/", controller.getAll); // GET /api/accounting-entries
router.get("/:id", controller.getById); // GET /api/accounting-entries/:id
router.put("/:id", controller.update); // PUT /api/accounting-entries/:id
router.delete("/:id", controller.delete); // DELETE /api/accounting-entries/:id

export default router;
