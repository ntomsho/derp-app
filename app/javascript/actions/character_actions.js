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
    character['race_traits'] = JSON.stringify(character.race_traits);
    character['trained_skills'] = JSON.stringify(character.trained_skills);
    character['inventory'] = JSON.stringify(character.inventory);
    character['current_specials'] = JSON.stringify(character.current_specials);
    // character['advancements'] = JSON.stringify(character.advancements);
    // character['favoriteTags'] = JSON.stringify(character.favoriteTags);
    // character['regulation'] = character.regulation ? "true" : "false";
    return $.ajax({
        method: "POST",
        url: "api/characters",
        data: { character }
    })
}