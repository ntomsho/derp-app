class Character < ApplicationRecord

    validates :user_id, presence: true
    validates :name, uniqueness: { scope: :campaign_id }

    belongs_to :user,
        foreign_key: :user_id,
        class_name: :User

    belongs_to :campaign,
        foreign_key: :campaign_id,
        class_name: :Campaign

end
