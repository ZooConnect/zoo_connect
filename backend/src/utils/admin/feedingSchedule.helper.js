export const buildFeedingScheduleForCreation = (query) => {
    const feedingScheduleInput = {
        animalId: query.animalId,
        staffId: query.staffId,
        feedingTime: query.feedingTime,
        foodType: query.foodType
    };
    const metadata = {};
    const propsToVerify = ["frequency", "notes"];

    for (const key of propsToVerify) {
        if (query[key]) metadata[key] = query[key];
    }
    return { feedingScheduleInput, metadata };
};

export const buildFeedingScheduleFilter = (query) => {
    const filter = {};
    const propsToVerify = ["feedingTime", "foodType", "frequency", "notes"];

    for (const key of propsToVerify) {
        if (query[key]) filter[key] = query[key];
    }
    return filter;
};
