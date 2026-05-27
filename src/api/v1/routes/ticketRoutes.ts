import { Router } from "express";
import {
    handleGetAllTickets,
    handleGetTicketById,
    handleCreateTicket,
    handleUpdateTicket,
    handleDeleteTicket,
    handleGetTicketUrgency,
} from "../controllers/ticketController";

const router: Router = Router();

router.get("/", handleGetAllTickets);
router.get("/:id", handleGetTicketById);
router.post("/", handleCreateTicket);
router.put("/:id", handleUpdateTicket);
router.delete("/:id", handleDeleteTicket);
router.get("/:id/urgency", handleGetTicketUrgency);

export default router;
