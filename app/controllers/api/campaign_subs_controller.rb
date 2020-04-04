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
        # May need to change find method here
        @sub = CampaignSub.find(params[:id])
        sub_id = @sub.id
        @sub.destroy
        render {id: sub_id}
    end

    private

    def sub_params
        params.require(:campaign_sub).permit(:user_id, :campaign_id, :is_director)
    end

end
