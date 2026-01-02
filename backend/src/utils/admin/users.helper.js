export const buildUserForCreation = (query) => {
    const userInput = {
        name: query.name,
        email: query.email,
        password: query.password,
        passwordConfirmation: query.passwordConfirmation
    };
    const metadata = {};
    const propsToVerify = ["role", "membershipType", "membershipExpirationDate", "membershipStatus"];

    for (const key of propsToVerify) {
        if (query[key]) metadata[key] = query[key];
    }
    return { userInput, metadata };
};

export const buildUserFilter = (query) => {
    const filter = {};
    const propsToVerify = ["role", "membershipType", "membershipExpirationDate", "membershipStatus"];

    for (const key of propsToVerify) {
        if (query[key]) filter[key] = query[key];
    }
    return filter;
};
