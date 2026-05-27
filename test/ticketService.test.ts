import { calculateUrgency } from "../src/api/v1/services/ticketService";
import { Ticket } from "../src/api/v1/interfaces/ticket";

function createMockTicket(overrides: Partial<Ticket> = {}): Ticket {
    return {
        id: 1,
        title: "Test Ticket",
        description: "Test Description",
        priority: "medium",
        status: "open",
        createdAt: new Date().toISOString(),
        ...overrides,
    };
}

describe("calculateUrgency", () => {
    it("should return RESOLVED for resolved tickets with score 0", () => {
        // Arrange
        const ticket: Ticket = createMockTicket({ status: "resolved" });

        // Act
        const result = calculateUrgency(ticket);

        // Assert
        expect(result.urgencyLevel).toBe("RESOLVED");
        expect(result.urgencyScore).toBe(0);
    });

    it("should calculate LOW urgency for a new low-priority ticket", () => {
        // Arrange
        const ticket: Ticket = createMockTicket({
            priority: "low",
            createdAt: new Date().toISOString(),
        });

        // Act
        const result = calculateUrgency(ticket);

        // Assert
        expect(result.urgencyScore).toBe(10);
        expect(result.urgencyLevel).toBe("LOW");
    });

    it("should increase urgency score with ticket age", () => {
        // Arrange - ticket created 10 days ago with high priority
        const tenDaysAgo: Date = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        const ticket: Ticket = createMockTicket({
            priority: "high",
            createdAt: tenDaysAgo.toISOString(),
        });

        // Act
        const result = calculateUrgency(ticket);

        // Assert: base 30 + (10 * 2) = 50
        expect(result.urgencyScore).toBe(50);
        expect(result.urgencyLevel).toBe("HIGH");
    });

    it("should return CRITICAL urgency for old critical tickets", () => {
        // Arrange - critical ticket created 20 days ago
        const twentyDaysAgo: Date = new Date();
        twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

        const ticket: Ticket = createMockTicket({
            priority: "critical",
            createdAt: twentyDaysAgo.toISOString(),
        });

        // Act
        const result = calculateUrgency(ticket);

        // Assert: base 50 + (20 * 2) = 90
        expect(result.urgencyScore).toBe(90);
        expect(result.urgencyLevel).toBe("CRITICAL");
    });
});
