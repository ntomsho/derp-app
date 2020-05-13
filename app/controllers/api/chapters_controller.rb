class Api::ChaptersController < ApplicationController

    def show
        @chapter = Chapter.find(params[:id])
        render :show
    end

    def create
        @chapter = Chapter.new(chapter_params)
        render json: ["Unauthorized"], status: 401 if current_user.id != Campaign.find(@chapter.campaign_id).director_id
        @chapter.start_time = @chapter.start_time.to_datetime if @chapter.start_time
        @chapter.end_time = @chapter.end_time.to_datetime if @chapter.end_time
        if @chapter.save
            render :show
        else
            render @chapter.errors.full_messages, status: 422
        end
    end

    def update
        @chapter = Chapter.find(params[:id])
        if @chapter.update(chapter_params)
            render :show
        else
            render @chapter.errors.full_messages, status: 422
        end
    end

    def destroy
        @chapter = Chapter.find(params[:id])
        chapter_id = @chapter.id
        @chapter.destroy
        render json: {chapter_id: chapter_id}
    end

    private

    def chapter_params
        params.require(:chapter).permit(:title, :description, :campaign_id, :start_time, :end_time)
    end

end
