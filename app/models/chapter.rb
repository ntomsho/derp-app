class Chapter < ApplicationRecord

    validates :campaign_id, presence: true

    belongs_to :campaign,
        foreign_key: :campaign_id,
        class_name: :Campaign

    has_one :director,
        through: :campaign,
        source: :director

    has_many :players,
        through: :campaign,
        source: :subscribing_users

end