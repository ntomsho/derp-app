export const snakeToCamel = (str) => str.replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', '')
);

export const camelToSnake = (field) => {
    return field
        .split(/(?=[A-Z])/)
        .map(x => x.toLowerCase())
        .join('_');
}