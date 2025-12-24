import jwt from 'jsonwebtoken';
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export class Utils {
    static SECRET = 'RANDOM_TOKEN_SECRET';
    static __filename = fileURLToPath(import.meta.url);
    static __dirname = path.dirname(__filename);

    static validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        return password.length > minLength && hasUpperCase && hasDigit;
    };

    static formatStatus(uptimeSec) {
        if (uptimeSec < 0) throw new Error("invalid uptime");
        if (uptimeSec < 60) return "warming-up";
        if (uptimeSec < 3600) return "healthy";
        return "steady";
    }

    static signToken(payload) {
        return jwt.sign(payload, this.SECRET, { expiresIn: '1h' });
    };

    static verifyToken(token) {
        return jwt.verify(token, this.SECRET);
    };

    static getRuntimeInfo() {
        return { node: process.version, uptime: process.uptime() };
    }

    static getPackageInfo() {
        const pkg = JSON.parse(
            fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf-8")
        );
        return { name: pkg.name, version: pkg.version };
    }
}