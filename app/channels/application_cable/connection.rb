module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      session = cookies.encrypted[Rails.application.config.session_options[:key]]
      self.current_user = User.find_by(session_token: session["session_token"])
    end
    
  end
end
