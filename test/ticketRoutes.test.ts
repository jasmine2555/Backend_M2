/* eslint-disable @typescript-eslint/typedef */
import request from "supertest";
import app from "../src/app";

describe("Health Check", () => {
    it("should return 200 and OK status", async () => {
        // Arrange & Act
        const response = await request(app).get("/api/v1/health");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
        expect(response.body).toHaveProperty("uptime");
        expect(response.body).toHaveProperty("timestamp");
        expect(response.body).toHaveProperty("version");
    });
});

describe("GET /api/v1/tickets", () => {
    it("should return all tickets with 200 status", async () => {
        // Arrange & Act
        const response = await request(app).get("/api/v1/tickets");

        // Assert
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });
});

describe("GET /api/v1/tickets/:id", () => {
    it("should return a single ticket by ID", async () => {
        // Arrange & Act
        const response = await request(app).get("/api/v1/tickets/1");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("title");
    });

    it("should return 404 for non-existent ticket", async () => {
        // Arrange & Act
        const response = await request(app).get("/api/v1/tickets/999");

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Ticket not found");
    });
});

describe("POST /api/v1/tickets", () => {
    it("should create a new ticket with valid data", async () => {
        // Arrange
        const newTicket = {
            title: "Test ticket",
            description: "Test description",
            priority: "high",
        };

        // Act
        const response = await request(app).post("/api/v1/tickets").send(newTicket);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe("Test ticket");
        expect(response.body.status).toBe("open");
    });

    it("should return 400 when description is missing", async () => {
        // Arrange
        const invalidTicket = {
            title: "Test ticket",
            priority: "high",
        };

        // Act
        const response = await request(app).post("/api/v1/tickets").send(invalidTicket);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Missing required field: description");
    });

    it("should return 400 when title is missing", async () => {
        // Arrange
        const invalidTicket = {
            description: "Test description",
            priority: "high",
        };

        // Act
        const response = await request(app).post("/api/v1/tickets").send(invalidTicket);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Missing required field: title");
    });
});

describe("PUT /api/v1/tickets/:id", () => {
    it("should update a ticket with valid data", async () => {
        // Arrange
        const updateData = { title: "Updated title" };

        // Act
        const response = await request(app).put("/api/v1/tickets/1").send(updateData);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated title");
    });

    it("should return 400 for invalid priority", async () => {
        // Arrange
        const updateData = { priority: "urgent" };

        // Act
        const response = await request(app).put("/api/v1/tickets/1").send(updateData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid priority. Must be one of: critical, high, medium, low");
    });

    it("should return 400 for invalid status", async () => {
        // Arrange
        const updateData = { status: "closed" };

        // Act
        const response = await request(app).put("/api/v1/tickets/1").send(updateData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid status. Must be one of: open, in-progress, resolved");
    });
});

describe("DELETE /api/v1/tickets/:id", () => {
    it("should delete an existing ticket", async () => {
        // Arrange - create a ticket to delete
        const createResponse = await request(app).post("/api/v1/tickets").send({
            title: "Ticket to delete",
            description: "Will be deleted",
            priority: "low",
        });
        const ticketId: number = createResponse.body.id;

        // Act
        const response = await request(app).delete(`/api/v1/tickets/${ticketId}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Ticket deleted successfully");
    });

    it("should return 404 when deleting non-existent ticket", async () => {
        // Arrange & Act
        const response = await request(app).delete("/api/v1/tickets/999");

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Ticket not found");
    });
});

describe("GET /api/v1/tickets/:id/urgency", () => {
    it("should return urgency data for an existing ticket", async () => {
        // Arrange & Act
        const response = await request(app).get("/api/v1/tickets/1/urgency");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("urgencyScore");
        expect(response.body).toHaveProperty("urgencyLevel");
        expect(response.body).toHaveProperty("priority");
    });

    it("should return 404 for urgency of non-existent ticket", async () => {
        // Arrange & Act
        const response = await request(app).get("/api/v1/tickets/999/urgency");

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Ticket not found");
    });
});
