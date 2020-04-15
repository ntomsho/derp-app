
def process_invites(collection, direction)
    sent_friend_invites = []
    sent_campaign_invites = []
    friend_invites = []
    campaign_invites = []

    collection.each do |invite|
        directory = invite.send(direction == 'sent' ? :requested : :requester)
        invite_type = directory.class.name.demodulize
        invite_obj = { id: invite.id, viewed: invite.viewed, created: invite.created_at }

        if invite_type == "Campaign"
            invite_obj[:title] = directory.title
            invite_obj[:director] = directory.director.username
        else
            invite_obj[:username] = directory.username
        end

        if direction == 'sent'
            invite_obj[:requested_id] = directory.id
            invite_type == "Campaign" ? sent_campaign_invites << invite_obj : sent_friend_invites << invite_obj
        else
            invite_obj[:requester_id] = directory.id
            invite_type == "Campaign" ? campaign_invites << invite_obj : friend_invites << invite_obj
        end
    end

    if direction == 'sent'
        { sent_campaign_invites: sent_campaign_invites, sent_friend_invites: sent_friend_invites }
    else
        { campaign_invites: campaign_invites, friend_invites: friend_invites }
    end
        
end

sent_invites = process_invites(user.sent_invites, 'sent')
received_invites = process_invites(user.received_invites, 'received')

join_requests = []
user.campaigns.each do |campaign|
    if campaign.director.id == user.id
        campaign.requested_invites.each do |invite|
            copy = invite.as_json
            copy[:campaign_title] = campaign.title
            copy[:username] = User.find(invite.requester_id).username
            join_requests << copy
        end
    end
end

json.extract! user, :id, :username, :email

json.sent_friend_invites sent_invites[:sent_friend_invites]
json.sent_campaign_invites sent_invites[:sent_campaign_invites]
json.friend_invites received_invites[:friend_invites]
json.campaign_invites received_invites[:campaign_invites]
json.join_requests join_requests
