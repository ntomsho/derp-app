class GameChannel < ApplicationCable::Channel

    def subscribed
        @game = Chapter.find(params[:game_id])
        @character = params[:character_id] == "Director" ? "Director" : Character.find(params[:character_id])
        character_id = @character == "Director" ? "" : @character.id
        if redis.get("state")
            state = JSON.parse(redis.get("state"))
        else
            state = {'characters': {}, 'clocks': { 'challenges': [], 'countdowns': [], 'derp': 0 }}.with_indifferent_access
        end
        unless @character == "Director"
            state['characters'][character_id] = { user_id: current_user.id, username: current_user.username, character: @character.as_json }
        end
        redis.set("state", JSON.generate(state))
        stream_for @game
        GameChannel.broadcast_to(@game, { state: state, message: {charId: character_id, login: { username: current_user.username, characterName: @character == "Director" ? "the Director" : @character.name }} })
    end

    def speak(data)
        state = data['state']
        redis.set("state", JSON.generate(state))
        GameChannel.broadcast_to(@game, { state: state, message: data['change'] })
    end

    def unsubscribed
        if @character.id
        state = JSON.parse(redis.get("state"))
        @character.update(state['characters'][@character.id.to_s]['character'])
        state['characters'].delete(@character.id.to_s)
        redis.set("state", JSON.generate(state))
        GameChannel.broadcast_to(@game, { state: state, message: { logout: { username: current_user.username } } })
        end
    end

    private

    def redis
        Redis.new
    end

end