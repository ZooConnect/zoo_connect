/*
EXPLICATION FONCTIONNEMENT
La règle fondamentale d’Express

Tout middleware appelé avec next(err)
👉 court-circuite la chaîne normale
👉 et saute directement au prochain middleware d’erreur

Express fait exactement ceci :

1. Stoppe immédiatement la chaîne normale
2. Ignore tous les middlewares (req, res, next)
3. Cherche le prochain middleware avec 4 arguments
4.Lui passe err
👉 C’est garanti par le design d’Express, pas une convention.
*/

import { respond } from "../helpers/response.helper.js";

export class CustomError extends Error {
  constructor({ status, message }) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(err, _req, res, _next) {
  const status = err?.status ?? 500;
  const message = err?.message ?? "Internal Server Error";
  respond(res, { message, status }, { error: true });
}
