class Campaign < ApplicationRecord

    belongs_to :director,
        foreign_key: :director_id,
        class_name: :User

    has_many :campaign_subs,
        foreign_key: :campaign_id,
        class_name: :CampaignSubs

    has_many :characters,
        foreign_key: :campaign_id,
        class_name: :Character

    has_many :subscribing_users,
        through: :campaign_subs,
        source: :user

end