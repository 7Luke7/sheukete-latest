"use server";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const issue_token = async (audience) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const privateKey = fs.readFileSync(path.join(__dirname, "private.key"), 'utf8');

    try {
        return new Promise((resolve, reject) => {
            jwt.sign(
                {
                    iss: "main-server",
                    aud: audience,
                },
                privateKey,
                { algorithm: "RS256", expiresIn: "1h" },
                (err, encoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(encoded);
                    }
                }
            );
        });
    } catch (error) {
        console.log("JWT-ERROR: ", error);
        throw error; // Propagate the error
    }
};