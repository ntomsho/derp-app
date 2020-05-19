if Rails.env.production?
    uri = URI.parse(ENV['REDISTOGO_URL'])
else
    uri = 'redis://localhost:6379'
end

REDIS = Redis.new(url: uri)