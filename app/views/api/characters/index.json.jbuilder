@characters.each do |character|
  json.set! character.id do
    json.partial! 'character', character: character
  end
end