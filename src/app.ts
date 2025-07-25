import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to KoylaPizzaGrill Server 🍕" });
});
export default app;
