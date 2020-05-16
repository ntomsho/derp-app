var token = $('meta[name=csrf-token]').attr('content');

export const signup = (user, callback, setErrors) => {
    return $.ajax({
        method: "POST",
        url: "/api/users",
        data: { user },
        headers: { 'X-CSRF-Token': token },
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
        headers: {'X-CSRF-Token': token},
        success: callback,
        error: (errors) => setErrors(errors.responseJSON)
    })
    // }).then(user => callback(user));
};

export const logout = (callback) => {
    return $.ajax({
        method: "DELETE",
        url: "/api/session",
        headers: { 'X-CSRF-Token': token }
    }).then(() => callback(null));
};