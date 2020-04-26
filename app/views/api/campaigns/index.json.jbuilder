@campaigns.each do |campaign|
    json.set! campaign.id do
        json.partial! 'campaign_light', campaign: campaign
    end
end
