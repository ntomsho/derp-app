Rails.application.routes.draw do
  namespace :api, defaults: {format: :json} do
    resource :session, only: [:create, :destroy, :show]
    resources :users, except: [:new, :edit, :destroy]
    resources :ged do
      collection do
        resources :campaigns, except: [:new, :edit]
        resources :campaign_subs, except: [:show, :new, :edit, :update]
        resources :characters, except: [:new, :edit]
        resources :invites, only: [:create, :update, :destroy]
      end
    end
  end
  
  root "static_pages#root"
end
# Try making another namespace for :ged with a controller that only renders an 
# index and nesting all the resources underneath it

# That fails, try cutting ged/home out of it and just making that landing page part of '/' for now