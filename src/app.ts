import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { envVars } from "./app/config/env";
import Stripe from "stripe";
import { OrderControllers } from "./app/modules/order/order.controller";

const app = express();

export const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);
app.post(
  "/api/v1/order/webhook",
  express.raw({ type: "application/json" }),
  OrderControllers.stripeWebhook
);

app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [envVars.URL as string],
    credentials: true,
  })
);
console.log();

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to KoylaPizzaGrill Server 🍕" });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
