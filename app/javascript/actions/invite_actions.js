export const createInvite = (invite) => {
    return $.ajax({
        method: "POST",
        url: "api/invites",
        data: { invite }
    })
};

export const deleteInvite = (invite_id, accepted) => {
    return $.ajax({
        method: "DELETE",
        url: `api/invites/${invite_id}`,
        accepted: { accepted }
    })
}