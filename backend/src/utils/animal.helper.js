export const buildAnimalFilter = (query) => {
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
