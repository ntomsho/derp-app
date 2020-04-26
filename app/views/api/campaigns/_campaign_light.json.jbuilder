director = { id: campaign.director.id, username: campaign.director.username }

json.extract! campaign, :id, :title, :description

json.director director
