class CampaignSub < ApplicationRecord

    validates :user_id, presence: true
    validates :campaign_id, presence: true

    belongs_to :user,
        foreign_key: :user_id,
        class_name: :User

    belongs_to :campaign,
        foreign_key: :campaign_id,
        class_name: :Campaign

    def characters
        self.user.characters.where(campaign_id: self.campaign_id)
    end

end