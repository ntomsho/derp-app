export const fetchCharacters = (user_id, callback) => {
    return $.ajax({
        method: "GET",
        url: "api/characters",
        data: { user_id }
    }).then(characters => callback(Object.assign([], Object.values(characters))));
};