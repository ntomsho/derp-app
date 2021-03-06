class User < ApplicationRecord

    validates :email, presence: true, uniqueness: true
    validates :username, presence: true, uniqueness: true
    validates :password_digest, presence: true
    validates :session_token, presence: true
    validates :password, length: {minimum: 6}, allow_nil: true

    after_initialize :ensure_session_token
    attr_reader :password
    
    has_many :characters,
        foreign_key: :user_id,
        class_name: :Character

    has_many :campaign_subs,
        foreign_key: :user_id,
        class_name: :CampaignSub

    has_many :campaigns,
        through: :campaign_subs,
        source: :campaign

    has_many :sent_invites, class_name: :Invite, as: :requester
    
    has_many :received_invites, class_name: :Invite, as: :requested

    def directing_in
        self.campaigns.where(director: self)
    end

    def playing_in
        self.campaigns.where.not(director: self)
    end

    def password=(password)
        @password = password
        self.password_digest = BCrypt::Password.create(password)
    end

    def reset_session_token!
        self.session_token = self.class.generate_session_token
        self.save!
        self.session_token
    end

    def ensure_session_token
        self.session_token ||= self.class.generate_session_token
    end

    def self.find_by_credentials(email, password)
        user = User.find_by({email: email})
        return nil unless user && user.is_password(password)
        user
    end

    def is_password(password)
        bcrypt_password = BCrypt::Password.new(password_digest)
        bcrypt_password.is_password?(password)
    end

    def self.generate_session_token
        SecureRandom::urlsafe_base64
    end

end
