export const fetchCharacters = (user_id, callback) => {
    return $.ajax({
        method: "GET",
        url: "api/characters",
        data: { user_id }
    }).then(characters => callback(Object.assign([], Object.values(characters))));
};

export const fetchCharacter = (id, callback) => {
    return $.ajax({
        method: "GET",
        url: `api/characters/${id}`
    }).then(character => callback(Object.assign({}, character)));
};

export const createCharacter = (character) => {
    return $.ajax({
        method: "POST",
        url: "api/characters",
        data: { character }
    })
}