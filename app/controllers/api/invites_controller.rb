class Api::InvitesController < ApplicationController

    def create
        @invite = Invite.new
        @invite.requester = params[:invite][:requester_type].constantize.find(params[:invite][:requester_id])
        @invite.requested = params[:invite][:requested_type].constantize.find(params[:invite][:requested_id])
        if @invite.save
            render :show
        else
            render json: @invite.errors.full_messages, status: 422
        end
    end

    def update
        @invite = Invite.find(params[:id])
        if @invite.update(viewed: params[:invite][:viewed])
        else
            render json: @invite.errors.full_messages, status: 422
        end
    end

    def destroy
        @invite = Invite.find(params[:id])
        invite_id = @invite.id
        join_campaign(@invite) if params[:accepted] == "true"
        @invite.destroy
        render json: {id: invite_id}
    end

    private

    def invite_params
        params.require(:invite).permit(:accepted, :viewed, :requester_type, :requester_id, :requested_type, :requested_id)
    end

    def join_campaign(invite)
        if invite.requester.class.name == "Campaign"
            CampaignSub.create(user_id: invite.requested.id, campaign_id: invite.requester.id, is_director: false)
        else
            CampaignSub.create(user_id: invite.requester.id, campaign_id: invite.requested.id, is_director: false)
        end
    end

end
