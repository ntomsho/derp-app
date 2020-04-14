class Api::CharactersController < ApplicationController

    def index
        @characters = Character.where(user_id: params[:user_id])
        render :index
    end

    def show
        @character = Character.find(params[:id])
        render :show
    end

    def create
        @character = Character.new(character_params)
        @character.user_id = current_user.id
        if @character.save
            # unless @character.campaign.is_subbed?(current_user.id)
            #     CampaignSub.create(user_id: current_user.id, campaign_id: @character.campaign_id, is_director: false)
            # end
            render "api/characters/show"
        else
            render json: @character.errors.full_messages, status: 422
        end
    end

    def update
        @character = Character.find(params[:id])
        if @character.update(character_params)
            render "api/characters/show"
        else
            render json: @character.errors.full_messages, status: 422
        end
    end

    def destroy
        @character = Character.find(params[:id])
        character_id = @character.id
        @character.destroy
        render json: {id: character_id}
    end

    private

    def character_params
        params.require(:character).permit(:campaign_id, :name, :c_class, :race_string, :race_traits, :background, 
        :appearance, :derp, :health, :max_health, :plot_points, :selected_fighting_skill, :trained_skills, 
        :current_specials, :inventory, :level, :experience, :advancements, :saved_tag, :regulation)
    end

end