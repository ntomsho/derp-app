class GameChannel < ApplicationCable::Channel

    def subscribed
        campaign = Campaign.find(params[:id])
        stream_for campaign
    end

    def unsubscribed
    end

end