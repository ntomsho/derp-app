class AddIndexUserIdToCampaigns < ActiveRecord::Migration[6.0]
  def change
    add_index :campaign_subs, :user_id
    add_index :campaign_subs, :campaign_id
  end
end
