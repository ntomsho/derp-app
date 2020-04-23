class Api::CampaignsController < ApplicationController

    def index
        unless params[:search_params]
            @campaigns = Campaign.all().order(updated_at: :desc).limit(20)
        else
            parameter = params[:search_params].keys.first
            value = params[:search_params][parameter]
            case parameter
                when "user_id"
                    @campaigns = User.find(value).campaigns.limit(20)
                when "user_playing"
                    @campaigns = User.find(value).playing_in.limit(20)
                when "director"
                    @campaigns = Campaign.where(director: { id: value }).campaigns.limit(20)
            end
            # @campaigns = Campaign.where("? LIKE ?", parameter, params[:search_params][parameter]).order(updated_at: :desc)
        end
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
