
def invite_obj(invite)
    new_invite = invite.as_json
    if new_invite['requester_type'] == "User"
        new_invite['requester_username'] = invite.requester.username
    else
        new_invite['requester_title'] = invite.requester.title
        new_invite['requester_director'] = {'id': invite.requester.director.id, 'username': invite.requester.director.username}
    end
    if new_invite['requested_type'] == "User"
        new_invite['requested_username'] = invite.requested.username
    else
        new_invite['requested_title'] = invite.requested.title
        new_invite['requested_director'] = {'id': invite.requested.director.id, 'username': invite.requested.director.username}
    end
    new_invite
end

sent = Invite.where(requester_type: "User", requester_id: user.id)
requested = Invite.where(requested_type: "User", requested_id: user.id)
campaigns_sent = Invite.where(requester_type: "Campaign", requester_id: user.directing_in.ids)
campaigns_requested = Invite.where(requested_type: "Campaign", requested_id: user.directing_in.ids)

json.extract! user, :id, :username, :email

json.sent_invites sent.map {|invite| invite_obj(invite)}
json.received_invites requested.map {|invite| invite_obj(invite)}
json.campaign_sent_invites campaigns_sent.map {|invite| invite_obj(invite)}
json.campaign_received_invites campaigns_requested.map {|invite| invite_obj(invite)}
