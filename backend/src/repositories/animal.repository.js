import Animal from "../models/animal.model.js";

const createAnimal = async (animal, metadata = {}) => {
    const { name, species, age, habitat } = animal;
    return Animal.create(
        {
            name,
            species,
            age,
            habitat,
            ...metadata
        }
    )
}

const fastReadAnimalById = async (id) => Animal.exists(id);

const readAnimalById = async (id) => {
    return Animal.findById(id)
        .lean();
}

const readAnimals = async (filter) => {
    return Animal.find(filter)
        .lean();
}

const updateAnimal = async (id, updates) => {
    return Animal.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        timestamps: true
    });
}

export const deleteAnimal = async (animalId) => Animal.findByIdAndDelete(animalId);

export default {
    createAnimal,
    fastReadAnimalById,
    readAnimalById,
    readAnimals,
    updateAnimal,
    deleteAnimal
}