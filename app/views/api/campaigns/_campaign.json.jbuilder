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
json.characters characters
json.director director
json.subs subs