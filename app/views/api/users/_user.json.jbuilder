sent_friend_invites = []
sent_campaign_invites = []
friend_invites = []
campaign_invites = []


def process_invites(collection, direction)
    collection.each do |invite|
        directory = invite.send(direction == 'sent' ? :requested : :requester)
        invite_type = directory.class.name.demodulize
        invite_obj = { id: directory.id, created: invite.created_at }

        if invite_type == :Campaign
            invite_obj[:title] = directory.title
        else
            invite_obj[:username] = directory.username
        end

        if direction == 'sent'
            invite_type == :Campaign ? sent_campaign_invites << invite_obj : sent_friend_invites << invite_obj
        else
            invite_type == :Campaign ? campaign_invites << invite_obj : friend_invites << invite_obj
        end
    end
end

process_invites(user.sent_invites, 'sent')
process_invites(user.received_invites, 'received')

json.extract! user, :id, :username, :email

json.sent_friend_invites sent_friend_invites
json.sent_campaign_invites sent_campaign_invites
json.friend_invites friend_invites
json.campaign_invites campaign_invites
