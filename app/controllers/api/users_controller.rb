class Api::UsersController < ApplicationController

    def index
        @users = User.all()
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
