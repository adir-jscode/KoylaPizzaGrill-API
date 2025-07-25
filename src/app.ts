import express, { Request, Response } from "express";
import cors from "cors";
import { AdminRoutes } from "./app/modules/admin/admin.route";
import { router } from "./app/routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to KoylaPizzaGrill Server 🍕" });
});
export default app;
