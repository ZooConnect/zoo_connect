import { Router } from "express";

import { getPackageInfo, getRuntimeInfo } from "../utils/file.helper.js";

const router = Router();

router.get("/", (_req, res) => {
  const info = { ...getPackageInfo(), ...getRuntimeInfo() };
  res.status(200).json(info);
});

export default { router, prefix: "/info" };
