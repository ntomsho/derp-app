class Campaign < ApplicationRecord

    belongs_to :director,
        foreign_key: :director_id,
        class_name: :User

    has_many :campaign_subs,
        foreign_key: :campaign_id,
        class_name: :CampaignSub

    has_many :characters,
        foreign_key: :campaign_id,
        class_name: :Character

    has_many :subscribing_users,
        through: :campaign_subs,
        source: :user

    has_many :sent_invites, as: :requester

    has_many :requested_invites, as: :requested

    def is_subbed?(user_id)
        self.subscribing_users.any? { |user| user.id == user_id }
    end

end