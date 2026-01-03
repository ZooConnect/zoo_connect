import * as animalService from "../services/animal.service.js";

import { respond } from "../utils/response.helper.js";

import MESSAGES from "../constants/messages.js";

const buildAnimalFilter = (query) => {
  const filter = { status: 'active' };

  if (query.species) filter.species = query.species;
  if (query.habitat) filter.habitat = query.habitat;

  if (query.age) {
    const age = Number(query.age);
    if (!Number.isNaN(age)) {
      filter.age = age;
    }
  }

  return filter;
};

export const getAnimals = async (req, res, next) => {
  try {
    const filter = buildAnimalFilter(req.query);
    const animals = await animalService.getAnimals(filter);
    respond(res, MESSAGES.ANIMAL.ANIMALS_FOUND, animals);
  } catch (error) {
    next(error);
  }
};

export const createAnimal = async (req, res, next) => {
  try {
    const animal = await animalService.createAnimal(req.body);
    respond(res, MESSAGES.ANIMAL.CREATED_SUCCESS, animal);
  } catch (error) {
    next(error);
  }
};

export const updateAnimal = async (req, res, next) => {
  try {
    const animalId = req.params.id;
    const animal = await animalService.updateAnimal(animalId, req.body);
    respond(res, MESSAGES.ANIMAL.UPDATE_SUCCESS, animal);
  } catch (error) {
    next(error);
  }
};

export const deleteAnimal = async (req, res, next) => {
  try {
    const animalId = req.params.id;
    await animalService.deleteAnimal(animalId);
    respond(res, MESSAGES.ANIMAL.DELETE_SUCCESS);
  } catch (error) {
    next(error);
  }
};