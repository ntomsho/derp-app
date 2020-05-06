module ApplicationCable
  class Connection < ActionCable::Connection::Base
    # identified_by :current_user

    # def connect
    #   self.current_user = verify_in_campaign
    # end

    # private

    # def verify_in_campaign
    #   if verified_user = Campaign.find(params[:campaign_id]).subscribed_users.includes(current_user.id)
    #     verified_user
    #   else
    #     reject_unauthorized_connection
    #   end
    # end
    
  end
end
