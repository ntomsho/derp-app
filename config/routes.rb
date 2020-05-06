Rails.application.routes.draw do
  namespace :api, defaults: {format: :json} do
    resource :session, only: [:create, :destroy, :show]
    resources :users, except: [:new, :edit, :destroy]
    resources :campaigns, except: [:new, :edit]
    resources :chapters, except: [:index, :new, :edit]
    resources :campaign_subs, except: [:show, :new, :edit, :update]
    resources :characters, except: [:new, :edit]
    resources :invites, only: [:create, :update, :destroy]
    post '/broadcast', to: 'chapters#broadcast'
  end
  
  root "static_pages#root"
  match "*path" => "static_pages#root", via: :all

  mount ActionCable.server => '/cable'
end
