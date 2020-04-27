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

def make_char_obj(character)
    return {id: character.id, name: character.name, level: character.level, c_class: character.c_class}
end

subs = []
dead_chars = []
campaign.campaign_subs.each do |sub|
    sub_obj = {id: sub.id, user_id: sub.user.id, username: sub.user.username, characters: []}
    sub.characters.each {|char| char.dead ? dead_chars << make_char_obj(char) : sub_obj[:characters] << make_char_obj(char) }
    subs << sub_obj
end

json.extract! campaign, :id, :title, :description
json.sent_invites sent_invites
json.requested_invites requested_invites
json.dead_chars dead_chars
json.director director
json.subs subs
