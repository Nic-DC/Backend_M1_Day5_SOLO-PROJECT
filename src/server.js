import express from "express";
import reviewsRouter from "./api/reviews/index.js";
import productsRouter from "./api/products/index.js";
import filesRouter from "./api/files/index.js";

import listEndpoints from "express-list-endpoints";

import { join } from "path";

import { badRequestHandler, notFoundHandler, serverErrorHandler } from "./errorHandler.js";

// import cors from "cors";

const server = express();

const port = 3005;

const publicFolderPath = join(process.cwd(), "./public");

server.use(express.static(publicFolderPath));
// server.use(cors()); // Just to let FE communicate with BE successfully
server.use(express.json());

/*-----------ENDPOINTS-------------*/
server.use("/products", productsRouter);
server.use("/products", reviewsRouter);
server.use("/products", filesRouter);

/*-----------ERROR HANDLERS-------------*/
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(serverErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("The server is running on port:", port);
});
