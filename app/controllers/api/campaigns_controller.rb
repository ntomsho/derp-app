class Api::CampaignsController < ApplicationController

    def index
        unless params[:search_params]
            @campaigns = Campaign.all().order(updated_at: :desc).limit(20)
        else
            filters = params[:search_params].keys
            @campaigns = User.find(params[:search_params]['user_id']).campaigns.order(updated_at: :desc)if filters.include?('user_id')
            @campaigns = User.find(params[:search_params]['user_playing']).playing_in.order(updated_at: :desc) if filters.include?('user_playing')
            @campaigns = Campaign.where(director: { id: params[:search_params]['director'] }).campaigns.order(updated_at: :desc) if filters.include?('director')
            @campaigns = Campaign.where.not(id: User.find(params[:search_params]['user_not_playing']).campaign_ids).order(updated_at: :desc) if filters.include?('user_not_playing')
            @campaigns = @campaigns.where('title LIKE :search', search: "%#{params[:search_params]['query']}%") if filters.include?('query')
            @campaigns = @campaigns.limit(params[:search_params]['limit']) if filters.include?('limit')
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
