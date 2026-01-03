import { CustomError } from "../middlewares/errorHandler.js";

import animalRepo from "../repositories/animal.repository.js";

import { parseDate, dateIsPastFrom } from '../utils/date.helper.js';

import MESSAGES from "../constants/messages.js";

export const getAnimals = async (filter) => {
    const animals = await animalRepo.readAnimals(filter);
    return animals;
}

export const createAnimal = async (animalData) => {
    const animal = await animalRepo.createAnimal(animalData);
    return animal;
}

export const updateAnimal = async (animalId, updates) => {
    const animal = await animalRepo.updateAnimal(animalId, updates);
    return animal;
}

export const deleteAnimal = async (animalId) => {
    await animalRepo.deleteAnimal(animalId);
}