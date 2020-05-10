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

    def player_characters (user_id)
        return unless self.players.pluck(:id).include?(user_id)
        return Character.where(user_id: user_id, campaign_id: self.campaign_id, dead: nil) || []
    end

end