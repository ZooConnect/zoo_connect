import * as animalService from "../services/animal.service.js";

import { respond } from "../utils/response.helper.js";
import { buildAnimalFilter } from "../utils/animal.helper.js";

import MESSAGES from "../constants/messages.js";




export const getAnimals = async (req, res, next) => {
  try {
    const filter = buildAnimalFilter(req.query);
    const animals = await animalService.getAnimals(filter);
    respond(res, MESSAGES.ANIMAL.ANIMALS_FOUND, animals);
  } catch (error) {
    next(error);
  }
};