class Invite < ApplicationRecord

    belongs_to :requester, polymorphic: true

    belongs_to :requested, polymorphic: true

end
