import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import ticketRoutes from "./api/v1/routes/ticketRoutes";
import HttpStatusCode from "./constants/httpStatusCodes";

const app: Application = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

app.use("/api/v1/tickets", ticketRoutes);

export default app;
