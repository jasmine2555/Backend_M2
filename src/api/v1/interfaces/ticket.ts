export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: "critical" | "high" | "medium" | "low";
    status: "open" | "in-progress" | "resolved";
    createdAt: string;
}

export interface CreateTicketRequest {
    title: string;
    description: string;
    priority: string;
}

export interface UpdateTicketRequest {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
}

export interface UrgencyResponse {
    id: number;
    title: string;
    priority: string;
    status: string;
    createdAt: string;
    urgencyScore: number;
    urgencyLevel: string;
}
