import Animal from "../models/animal.model.js";



export const getAnimals = async (req, res, next) => {
  try {
    const { species, habitat, age } = req.query;
    const filter = { status: 'active' };

    if (species) filter.species = species;
    if (habitat) filter.habitat = habitat;
    if (age) filter.age = age;

    const animals = await Animal.find(filter);
    res.status(200).json(animals);
  } catch (error) {
    next(error);
  }
};