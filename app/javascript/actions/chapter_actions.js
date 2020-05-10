export const fetchChapter = (game_id, callback) => {
    return $.ajax({
        method: "GET",
        url: `/api/chapters/${game_id}`
    }).then(game => callback(Object.assign({}, game)));
}