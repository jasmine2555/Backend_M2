import { Request, Response } from "express";
import HttpStatusCode from "../../../constants/httpStatusCodes";
import { Ticket, UrgencyResponse } from "../interfaces/ticket";
import {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    calculateUrgency,
} from "../services/ticketService";

export function handleGetAllTickets(_req: Request, res: Response): void {
    const tickets: Ticket[] = getAllTickets();
    res.status(HttpStatusCode.OK).json(tickets);
}

export function handleGetTicketById(req: Request, res: Response): void {
    const id: number = parseInt(req.params.id as string, 10);
    const ticket: Ticket | undefined = getTicketById(id);

    if (!ticket) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "Ticket not found" });
        return;
    }

    res.status(HttpStatusCode.OK).json(ticket);
}

export function handleCreateTicket(req: Request, res: Response): void {
    const result: { ticket?: Ticket; error?: string } = createTicket(req.body);

    if (result.error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: result.error });
        return;
    }

    res.status(HttpStatusCode.CREATED).json(result.ticket);
}

export function handleUpdateTicket(req: Request, res: Response): void {
    const id: number = parseInt(req.params.id as string, 10);
    const result: { ticket?: Ticket; error?: string } = updateTicket(id, req.body);

    if (result.error === "Ticket not found") {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: result.error });
        return;
    }

    if (result.error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: result.error });
        return;
    }

    res.status(HttpStatusCode.OK).json(result.ticket);
}

export function handleDeleteTicket(req: Request, res: Response): void {
    const id: number = parseInt(req.params.id as string, 10);
    const deleted: boolean = deleteTicket(id);

    if (!deleted) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "Ticket not found" });
        return;
    }

    res.status(HttpStatusCode.OK).json({ message: "Ticket deleted successfully" });
}

export function handleGetTicketUrgency(req: Request, res: Response): void {
    const id: number = parseInt(req.params.id as string, 10);
    const ticket: Ticket | undefined = getTicketById(id);

    if (!ticket) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "Ticket not found" });
        return;
    }

    const urgency: UrgencyResponse = calculateUrgency(ticket);
    res.status(HttpStatusCode.OK).json(urgency);
}
