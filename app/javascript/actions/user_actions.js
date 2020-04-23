export const fetchUsers = (search_params, callback) => {
    return $.ajax({
        method: "GET",
        url: "/api/users",
        data: { search_params }
    }).then(users => callback(Object.assign([], Object.values(users))));
};
