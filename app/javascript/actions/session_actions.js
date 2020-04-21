export const signup = (user, callback) => {
    return $.ajax({
        method: "POST",
        url: "/api/users",
        data: { user }
    }).then(user => callback(user));
};

export const signin = (user, callback) => {
    return $.ajax({
        method: "POST",
        url: "/api/session",
        data: { user }
    }).then(user => callback(user));
};

export const logout = (callback) => {
    return $.ajax({
        method: "DELETE",
        url: "/api/session"
    }).then(() => callback(null));
};