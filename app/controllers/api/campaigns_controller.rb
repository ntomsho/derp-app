class Api::CampaignsController < ApplicationController

    def index
        @campaigns = Campaign.all().order(updated_at: :desc)
        render :index
    end

    def show
        @campaign = Campaign.find(params[:id])
        render :show
    end

    def create
        @campaign = Campaign.new(campaign_params)
        @campaign.director_id = current_user.id
        if @campaign.save
            CampaignSub.create(user_id: current_user.id, campaign_id: @campaign.id, is_director: true)
            render "api/campaigns/show"
        else
            render json: @campaign.errors.full_messages, status: 422
        end
    end

    def update
        @campaign = Campaign.find(params[:id])
        if @campaign.update(campaign_params)
            render "api/campaigns/show"
        else
            render json: @campaign.errors.full_messages, status: 422
        end
    end

    def destroy
        @campaign = Campaign.find(params[:id])
        campaign_id = @campaign.id
        @campaign.destroy
        render json: {id: campaign_id}
    end

    private

    def campaign_params
        params.require(:campaign).permit(:title, :description)
    end

end
