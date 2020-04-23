class Api::UsersController < ApplicationController

    def index
        unless params[:search_params]
            @users = User.all().order(updated_at: :desc).limit(20)
        else
            filters = params[:search_params].keys
            @users = Campaign.find(params[:search_params]['campaign_id']).subscribing_users.limit(20) if filters.include?('campaign_id')
            @users = User.where.not(id: Campaign.find(params[:search_params]['not_in_campaign_id']).subscribing_user_ids).order(updated_at: :desc).limit(20) if filters.include?('not_in_campaign_id')
            @users = @users.where('username LIKE :search OR email LIKE :search', search: "%#{params[:search_params]['query']}%") if filters.include?('query')
        end
        render :index
    end

    def show
        @users = User.find(params[:id])
        render :show
    end

    def create
        @user = User.new(user_params)
        if @user.save
            signin(@user)
            render "api/users/show"
        else
            render json: @user.errors.full_messages, status: 422
        end
    end

    def update
        @user = User.find(params[:id])
        if @user.update(user_params)
            render "api/users/show"
        else
            render json: @user.errors.full_messages, status: 422
        end
    end

    private

    def user_params
        params.require(:user).permit(:email, :username, :password)
    end

end
