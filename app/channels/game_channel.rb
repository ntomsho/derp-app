class GameChannel < ApplicationCable::Channel

    def subscribed
        @game = Chapter.find(params[:game_id])
        # character = Character.find(params[:character_id])
        @character = current_user.characters.first
        character_id = @character.id
        if redis.get("state")
            state = JSON.parse(redis.get("state"))
        else
            state = {'characters': {}, 'clocks': []}
        end
        state['characters'][character_id] = { user_id: current_user.id, username: current_user.username, character: @character }
        redis.set("state", JSON.generate(state))
        stream_for @game
        GameChannel.broadcast_to(@game, { state: state, message: {login: { user_id: current_user.id, username: current_user.username, character: @character.name }} })
    end

    def speak(data)
        state = data['state']
        redis.set("state", JSON.generate(state))
        GameChannel.broadcast_to(@game, { state: state, message: data['changes'] })
    end

    def unsubscribed
        state = JSON.parse(redis.get("state"))
        @character.update(state['characters'][@character.id]['character'])
        state['characters'].delete(@character.id.to_s)
        redis.set("state", JSON.generate(state))
        GameChannel.broadcast_to(@game, { state: state, message: {logout: { user_id: current_user.id, username: current_user.username } }})
    end

    private

    def redis
        Redis.new
    end

end