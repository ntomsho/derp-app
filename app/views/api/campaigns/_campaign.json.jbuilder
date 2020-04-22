sent_invites = []
requested_invites = []

campaign.sent_invites.each do |invite|
    sent_invites << { id: invite.id, requested_id: invite.requested.id, username: invite.requested.username, viewed: invite.viewed, created: invite.created_at }
end

campaign.requested_invites.each do |invite|
    requested_invites << { id: invite.id, requester_id: invite.requester.id, username: invite.requester.username, viewed: invite.viewed, created: invite.created_at }
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

alive_chars = []
dead_chars = []
campaign.characters.each do |character|
    char_obj = {id: character.id, name: character.name, level: character.level, c_class: character.c_class}
    character.dead ? dead_chars << character : alive_chars << character
end

json.extract! campaign, :id, :title, :description
json.sent_invites sent_invites
json.requested_invites requested_invites
json.alive_chars alive_chars
json.dead_chars dead_chars
json.director director
json.subs subs
