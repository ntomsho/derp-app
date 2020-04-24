class Api::CampaignSubsController < ApplicationController

    def index
        campaign = Campaign.find(params[:id])
        @subs = campaign.subscribing_users
        render :index
    end

    def create
        @sub = CampaignSub.create(sub_params)
        if @sub.save
            render :index
        else
            render json: @sub.errors.full_messages, status: 422
        end
    end

    def destroy
        @sub = Campaign.find(params[:campaign_id]).campaign_subs.find_by(user_id: params[:user_id])
        campaign_id = @sub.campaign_id
        user_id = @sub.user_id
        @sub.characters.each do |character|
            character.campaign_id = nil
            character.save
        end
        @sub.destroy
        render json: {user_id: user_id}
    end

    private

    def sub_params
        params.require(:campaign_sub).permit(:user_id, :campaign_id, :is_director)
    end

end
