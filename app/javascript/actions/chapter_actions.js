var token = $('meta[name=csrf-token]').attr('content');

export const fetchChapter = (game_id, callback) => {
    return $.ajax({
        method: "GET",
        url: `/api/chapters/${game_id}`
    }).then(game => callback(Object.assign({}, game)));
}

export const createChapter = (chapter, callback) => {
    return $.ajax({
        method: "POST",
        url: `/api/chapters`,
        data: { chapter },
        headers: { 'X-CSRF-Token': token },
        success: (game) => callback(game)
    })
}