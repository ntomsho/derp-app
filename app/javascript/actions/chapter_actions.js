export const fetchChapter = (game_id, callback) => {
    return $.ajax({
        method: "GET",
        url: `/api/games/${game_id}`
    }).then(game => callback(Object.assign({}, game)));
}

export const broadcastToChapter = (data) => {
    return $.ajax({
        method: "POST",
        url: `/api/broadcast`,
        data: { data }
    })
}