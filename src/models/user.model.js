import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Jira: "e-mail unique"
    password: { type: String, required: true }, // Jira: "mot de passe sécurisé"
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } // Jira: "Mise à jour des timestamps"
);

export default mongoose.model("User", userSchema);