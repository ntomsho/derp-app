Rails.application.routes.draw do
  namespace :api, defaults: {format: :json} do
    resources :users, except: [:new, :edit, :destroy]
    resources :campaigns, except: [:new, :edit]
    resources :campaign_subs, except: [:show, :new, :edit, :update]
    resources :characters, except: [:new, :edit]
  end
  
  root "static_pages#root"
end
