export const signup = (user, callback, setErrors) => {
    return $.ajax({
        method: "POST",
        url: "/api/users",
        data: { user },
        success: callback,
        error: (errors) => setErrors(errors.responseJSON)
    })
    // }).then(user => callback(user));
};

export const signin = (user, callback, setErrors) => {
    return $.ajax({
        method: "POST",
        url: "/api/session",
        data: { user },
        success: callback,
        error: (errors) => setErrors(errors.responseJSON)
    })
    // }).then(user => callback(user));
};

export const logout = (callback) => {
    return $.ajax({
        method: "DELETE",
        url: "/api/session"
    }).then(() => callback(null));
};