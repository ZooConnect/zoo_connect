import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const formatStatus = (uptimeSec) => {
    if (uptimeSec < 0) throw new Error("invalid uptime");
    if (uptimeSec < 60) return "warming-up";
    if (uptimeSec < 3600) return "healthy";
    return "steady";
}

export const getRuntimeInfo = () => {
    return { node: process.version, uptime: process.uptime() };
}

export const getPackageInfo = () => {
    const pkg = JSON.parse(
        fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf-8")
    );
    return { name: pkg.name, version: pkg.version };
}
