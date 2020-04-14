sent_invites = []
received_invites = []

campaign.sent_invites.each do |invite|
    sent_invites << { id: invite.requested.id, username: invite.requested.username, created: invite.created_at }
end

campaign.received_invites.each do |invite|
    received_invites << { id: invite.requester.id, username: invite.requester.username, created: invite.created_at }
end

director = { id: campaign.director.id, username: campaign.director.username }

characters = []
campaign.characters.each do |character|
    characters << {id: character.id, name: character.name, c_class: character.c_class, level: character.level,  
    player_name: character.user.username, player_id: character.user.id }
end

subs = []
campaign.campaign_subs.each do |sub|
    subs << sub
end

json.extract! campaign, :id, :title, :description
json.sent_invites sent_invites
json.received_invites received_invites
json.characters characters
json.director director
json.subs subs
