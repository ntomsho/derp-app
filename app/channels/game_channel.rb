class GameChannel < ApplicationCable::Channel

    def subscribed
        @game = Chapter.find(params[:game_id])
        stream_for @game
    end

    def received(data)
        debugger
        GameChannel.broadcast_to(@game, { game: @game, message: data.message })
    end

    def speak(message)
        GameChannel.broadcast_to(@game, { message: message })
    end

    def unsubscribed
    end

end