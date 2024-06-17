export const mapEnumConstantByValue = (constant = {}) => {
    const map = {};

    for (const key in constant) {
        map[constant[key].value] = constant[key];
    }

    return map;
};

export const mapEnumConstantToArray = (constant = {}) => {
    return Object.values(constant);
};
