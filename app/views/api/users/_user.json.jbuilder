
def process_invites(collection, direction)
    sent_friend_invites = []
    sent_campaign_invites = []
    friend_invites = []
    campaign_invites = []

    collection.each do |invite|
        directory = invite.send(direction == 'sent' ? :requested : :requester)
        invite_type = directory.class.name.demodulize
        invite_obj = { id: directory.id, viewed: invite.viewed, created: invite.created_at }

        if invite_type == "Campaign"
            invite_obj[:title] = directory.title
            invite_obj[:director] = directory.director.username
        else
            invite_obj[:username] = directory.username
        end

        if direction == 'sent'
            invite_type == "Campaign" ? sent_campaign_invites << invite_obj : sent_friend_invites << invite_obj
        else
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

json.extract! user, :id, :username, :email

json.sent_friend_invites sent_invites[:sent_friend_invites]
json.sent_campaign_invites sent_invites[:sent_campaign_invites]
json.friend_invites received_invites[:friend_invites]
json.campaign_invites received_invites[:campaign_invites]
