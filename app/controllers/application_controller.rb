class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user, :logged_in?
  before_action :verify_authenticity_token
  # before_action :ensure_logged_in

  def current_user
    return nil unless session[:session_token]
    @current_user ||= User.find_by(session_token: session[:session_token])
  end

  def ensure_logged_in
    unless current_user
      render json: { base: ['invalid credentials'] }, status: 401
    end
  end

  def signin(user)
    session[:session_token] = user.reset_session_token!
    @current_user = user
  end

  def logout
    @current_user.reset_session_token!
    session[:session_token] = nil
    @current_user = nil
  end

  def logged_in?
    !!current_user
  end

end
