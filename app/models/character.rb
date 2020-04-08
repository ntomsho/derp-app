class Character < ApplicationRecord

    scope :filter_by_user, -> (user_id) { where(user_id: user_id) }
    scope :filter_by_campaign, -> (campaign_id) { where(campaign_id: campaign_id) }

    belongs_to :user,
        foreign_key: :user_id,
        class_name: :User

    belongs_to :campaign,
        foreign_key: :campaign_id,
        class_name: :Campaign

end
