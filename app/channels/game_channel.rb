class GameChannel < ApplicationCable::Channel

    def subscribed
        @game = Chapter.find(params[:game_id])
        # character = Character.find(params[:character_id])
        @character = current_user.characters.first
        character_id = @character.id
        if redis.get("state")
            state = JSON.parse(redis.get("state"))
        else
            state = {}
        end
        state[character_id] = { user_id: current_user.id, username: current_user.username, character: @character }
        redis.set("state", JSON.generate(state))
        stream_for @game
        GameChannel.broadcast_to(@game, { state: state, login: { user_id: current_user.id, username: current_user.username, character: @character.name } })
    end

    def speak(message)
        GameChannel.broadcast_to(@game, { message: message })
    end

    def unsubscribed
        state = redis.get("state")
        state.delete(@character.id)
        redis.set("state", JSON.generate(state))
        GameChannel.broadcast_to(@game, { state: state, logout: { user_id: current_user.id, username: current_user.username } })
    end

    private

    def redis
        Redis.new
    end

end