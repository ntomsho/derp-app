campaign_subs = []
campaign.subs.each do |sub|
    campaign_subs << sub
end

json.extract! campaign, :id, :title, :description
json.subs = campaign_subs
