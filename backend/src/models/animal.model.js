import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    habitat: { type: String, required: true },
    description: { type: String },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'maintenance'], 
      default: 'active' 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Animal", animalSchema);