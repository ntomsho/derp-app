class Character < ApplicationRecord

    belongs_to :user,
        foreign_key: :user_id,
        class_name: :User

    belongs_to :campaign,
        foreign_key: :campaign_id,
        class_name: :Campaign

end