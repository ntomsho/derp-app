campaign = chapter.campaign
director_id = chapter.director.id

# players = {}
# chapter.players.each do |user|
#     if user.id !== director_id
#         players[user.id] = {id: user.id, username: user.username}
#     end
# end

json.extract! chapter, :id, :campaign_id, :title, :description, :start_time, :end_time

json.campaign campaign
json.director_id director_id