class AddIndices < ActiveRecord::Migration[6.0]
  def change

    add_index :campaigns, :title
    add_index :campaigns, [:title, :director_id], unique: true
    
    add_index :campaign_subs, [:user_id, :campaign_id], unique: true

    add_index :characters, [:name, :campaign_id], unique: true

    add_index :invites, :requester_id
    add_index :invites, :requested_id
    add_index :invites, [:requester_type, :requester_id, :requested_type, :requested_id], unique: true, name: 'index_invites_unique_combinations'

    add_index :users, :username

  end
end
