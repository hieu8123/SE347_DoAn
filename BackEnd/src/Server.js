import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import cors from "cors";
import { createServer } from 'http';
import * as path from 'path';
import initWebRoutes from "./route/Web";
import ErrorHandler from "./middleware/error";
import connectDatabase from "./database/Database";

const app = express();
const Server = createServer(app);

app.use(cors({
    origin: `http://localhost:${process.env.CLIENT_PORT}`,
    credentials: true
}));

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "../public/uploads")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initWebRoutes(app);

app.use(ErrorHandler);

// connect db
connectDatabase();

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for handling uncaught exception`);
});


const port = process.env.SERVER_PORT || 8080;

Server.listen(port, () => {
    console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}`);
})

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`shutting down the server for unhandle promise rejection`);

    Server.close(() => {
        process.exit(1);
    });
});