class GameChannel < ApplicationCable::Channel

    def subscribed
        @game = Chapter.find(params[:game_id])
        # character = Character.find(params[:character_id])
        @character = current_user.characters.first
        character_id = @character.id
        if redis.get("state")
            state = JSON.parse(redis.get("state"))
        else
            state = {'characters': {}, 'clocks': { 'challenges': [], 'countdowns': [], 'derp': 0 }}.with_indifferent_access
        end
        state['characters'][character_id] = { user_id: current_user.id, username: current_user.username, character: @character.as_json }
        redis.set("state", JSON.generate(state))
        stream_for @game
        GameChannel.broadcast_to(@game, { state: state, message: {charId: @character.id, login: { username: current_user.username, characterName: @character.name }} })
    end

    def speak(data)
        state = data['state']
        redis.set("state", JSON.generate(state))
        GameChannel.broadcast_to(@game, { state: state, message: data['change'] })
    end

    def unsubscribed
        state = JSON.parse(redis.get("state"))
        @character.update(state['characters'][@character.id.to_s]['character'])
        state['characters'].delete(@character.id.to_s)
        redis.set("state", JSON.generate(state))
        GameChannel.broadcast_to(@game, { state: state, message: { logout: { username: current_user.username } } })
    end

    private

    def redis
        Redis.new
    end

end