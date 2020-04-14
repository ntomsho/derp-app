Rails.application.routes.draw do
  namespace :api, defaults: {format: :json} do
    resource :session, only: [:create, :destroy, :show]
    resources :users, except: [:new, :edit, :destroy]
    resources :campaigns, except: [:new, :edit]
    resources :campaign_subs, except: [:show, :new, :edit, :update]
    resources :characters, except: [:new, :edit]
    resources :invites, only: [:create, :update, :destroy]
  end
  
  root "static_pages#root"
end
