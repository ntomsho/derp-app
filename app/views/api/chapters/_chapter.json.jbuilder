campaign = chapter.campaign
director_id = chapter.director.id

players = {}
chapter.players.each do |user|
    if user.id != chapter.director.id
        players[user.id] = []
    end
end

players.keys.each do |key|
    chapter.player_characters(key).each do |char|
        players[char.user.id].push(id: char.id, name: char.name, c_class: char.c_class, level: char.level)
    end
end

json.extract! chapter, :id, :campaign_id, :title, :description, :start_time, :end_time

json.campaign campaign
json.director_id director_id
json.players players