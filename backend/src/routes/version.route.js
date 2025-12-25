import { Router } from "express";

import Utils from "../utils/Utils.js";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({ version: Utils.getPackageInfo().version });
});

export default { router, prefix: "/version" };
