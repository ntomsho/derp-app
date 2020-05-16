var token = $('meta[name=csrf-token]').attr('content');

export const createInvite = (invite, callback) => {
    return $.ajax({
        method: "POST",
        url: "/api/invites",
        headers: { 'X-CSRF-Token': token },
        data: { invite }
    }).then(invite => callback(invite))
};

export const deleteInvite = (invite_id, accepted, callback) => {
    return $.ajax({
        method: "DELETE",
        url: `/api/invites/${invite_id}`,
        headers: { 'X-CSRF-Token': token },
        data: { accepted }
    }).then(deleted_id => callback(deleted_id))
};