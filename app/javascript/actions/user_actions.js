export const fetchUsers = (callback) => {
    return $.ajax({
        method: "GET",
        url: "api/users",
    }).then(users => callback(Object.assign([], Object.values(users))));
};
