class GameChannel < ApplicationCable::Channel

    def subscribed
        @game = Chapter.find(params[:game_id])
        # character = Character.find(params[:character_id])
        @character = current_user.characters.first
        redis.set("user:#{current_user.id}", @character)
        stream_for @game
        GameChannel.broadcast_to(@game, { login: { user_id: current_user.id, username: current_user.username, character: @character } })
    end

    def speak(message)
        GameChannel.broadcast_to(@game, { message: message })
    end

    def unsubscribed
        redis.del("user:#{current_user.id}")
        GameChannel.broadcast_to(@game, { logout: { user_id: current_user.id, username: current_user.username } })
    end

    private

    def redis
        Redis.new
    end

end