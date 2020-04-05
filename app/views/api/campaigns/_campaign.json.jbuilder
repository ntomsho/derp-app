campaign_subs = []
campaign.subs.each do |sub|
    campaign_subs << sub
end

characters = []
campaign.characters.each do |character|
    characters << character.id
end

json.extract! campaign, :id, :title, :description
json.subs = campaign_subs
