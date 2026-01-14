import { errorHandler } from './middlewares/error.middlewares';
import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";


const app: Application = express();

/**
 * Global middlewares
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */
app.use("/api", routes);

/**
 * Global error handler
 * Must be the last middleware
 */
app.use(errorHandler);

export default app;
