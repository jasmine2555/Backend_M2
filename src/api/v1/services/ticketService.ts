import { Ticket, CreateTicketRequest, UpdateTicketRequest } from "../interfaces/ticket";
import tickets from "../../../data/tickets";

const VALID_PRIORITIES: string[] = ["critical", "high", "medium", "low"];
const VALID_STATUSES: string[] = ["open", "in-progress", "resolved"];

export function getAllTickets(): Ticket[] {
    return tickets;
}

export function getTicketById(id: number): Ticket | undefined {
    return tickets.find((ticket: Ticket) => ticket.id === id);
}

export function createTicket(data: CreateTicketRequest): { ticket?: Ticket; error?: string } {
    if (!data.title) {
        return { error: "Missing required field: title" };
    }
    if (!data.description) {
        return { error: "Missing required field: description" };
    }
    if (!data.priority || !VALID_PRIORITIES.includes(data.priority)) {
        return { error: "Invalid priority. Must be one of: critical, high, medium, low" };
    }

    const newId: number = tickets.length > 0 ? Math.max(...tickets.map((t: Ticket) => t.id)) + 1 : 1;

    const newTicket: Ticket = {
        id: newId,
        title: data.title,
        description: data.description,
        priority: data.priority as Ticket["priority"],
        status: "open",
        createdAt: new Date().toISOString(),
    };

    tickets.push(newTicket);
    return { ticket: newTicket };
}

export function updateTicket(id: number, data: UpdateTicketRequest): { ticket?: Ticket; error?: string } {
    const ticketIndex: number = tickets.findIndex((ticket: Ticket) => ticket.id === id);

    if (ticketIndex === -1) {
        return { error: "Ticket not found" };
    }

    if (data.priority !== undefined && !VALID_PRIORITIES.includes(data.priority)) {
        return { error: "Invalid priority. Must be one of: critical, high, medium, low" };
    }

    if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
        return { error: "Invalid status. Must be one of: open, in-progress, resolved" };
    }

    const existingTicket: Ticket = tickets[ticketIndex];

    const updatedTicket: Ticket = {
        ...existingTicket,
        title: data.title ?? existingTicket.title,
        description: data.description ?? existingTicket.description,
        priority: data.priority !== undefined ? (data.priority as Ticket["priority"]) : existingTicket.priority,
        status: data.status !== undefined ? (data.status as Ticket["status"]) : existingTicket.status,
    };

    tickets[ticketIndex] = updatedTicket;
    return { ticket: updatedTicket };
}

export function deleteTicket(id: number): boolean {
    const ticketIndex: number = tickets.findIndex((ticket: Ticket) => ticket.id === id);

    if (ticketIndex === -1) {
        return false;
    }

    tickets.splice(ticketIndex, 1);
    return true;
}
