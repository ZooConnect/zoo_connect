import { Router } from "express";

import Utils from "../utils/Utils.js";

const router = Router();

router.get("/", (_req, res) => {
  const info = { ...Utils.getPackageInfo(), ...Utils.getRuntimeInfo() };
  res.status(200).json(info);
});

export default { router, prefix: "/info" };
