
# def process_invites(collection, direction)
#     sent_friend_invites = []
#     sent_campaign_invites = []
#     friend_invites = []
#     campaign_invites = []

#     collection.each do |invite|
#         directory = invite.send(direction == 'sent' ? :requested : :requester)
#         invite_type = directory.class.name.demodulize
#         invite_obj = { id: invite.id, viewed: invite.viewed, created: invite.created_at }

#         if invite_type == "Campaign"
#             invite_obj[:title] = directory.title
#             invite_obj[:director] = directory.director.username
#         else
#             invite_obj[:username] = directory.username
#         end

#         if direction == 'sent'
#             invite_obj[:requested_id] = directory.id
#             invite_type == "Campaign" ? sent_campaign_invites << invite_obj : sent_friend_invites << invite_obj
#         else
#             invite_obj[:requester_id] = directory.id
#             invite_type == "Campaign" ? campaign_invites << invite_obj : friend_invites << invite_obj
#         end
#     end

#     if direction == 'sent'
#         { sent_campaign_invites: sent_campaign_invites, sent_friend_invites: sent_friend_invites }
#     else
#         { campaign_invites: campaign_invites, friend_invites: friend_invites }
#     end
        
# end

# sent_invites = process_invites(user.sent_invites, 'sent')
# received_invites = process_invites(user.received_invites, 'received')

# join_requests = []
# user.campaigns.each do |campaign|
#     if campaign.director.id == user.id
#         campaign.requested_invites.each do |invite|
#             copy = invite.as_json
#             copy[:campaign_title] = campaign.title
#             copy[:username] = User.find(invite.requester_id).username
#             join_requests << copy
#         end
#     end
# end

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

# json.sent_friend_invites sent_invites[:sent_friend_invites]
# json.sent_campaign_invites sent_invites[:sent_campaign_invites]
# json.friend_invites received_invites[:friend_invites]
# json.campaign_invites received_invites[:campaign_invites]
# json.join_requests join_requests
