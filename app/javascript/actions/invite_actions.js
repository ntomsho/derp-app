export const createInvite = (invite) => {
    return $.ajax({
        method: "POST",
        url: "/api/invites",
        data: { invite }
    })
};

export const deleteInvite = (invite_id, accepted, callback) => {
    return $.ajax({
        method: "DELETE",
        url: `/api/invites/${invite_id}`,
        data: { accepted }
    }).then(deleted_id => callback(deleted_id))
};