CampaignSub.destroy_all
Campaign.destroy_all
Character.destroy_all
Invite.destroy_all
User.destroy_all

# Users

testman = User.create!(
    username: "ArthurTestman",
    email: "testy1@test.com",
    password: "password123"
)

cage = User.create!(
    username: "NicolasCage",
    email: "wild@heart.com",
    password: "notthebees"
)

andrea = User.create!(
    username: "AndreaRiseborough",
    email: "national@treasure.net",
    password: "iammandy"
)

spike = User.create!(
    username: "SpikeJonze",
    email: "notspike@lee.com",
    password: "malkovichmalkovich"
)

panos = User.create!(
    username: "PanosCosmatos",
    email: "beyond@black.rainbow",
    password: "pannycoz"
)

# Campaigns

adaptation = Campaign.create!(
    title: "Adaptation.",
    description: "A lovelorn screenwriter becomes desperate as he tries and fails to adapt 'The Orchid Thief' by Susan Orlean for the screen.",
    director_id: spike.id
)

season = Campaign.create!(
    title: "Season of the Witch",
    description: "Spike Jonze didn't actually direct this film.",
    director_id: spike.id
)

mandy = Campaign.create!(
    title: "Mandy",
    description: "The enchanted lives of a couple in a secluded forest are brutally shattered by a nightmarish hippie cult and their demon-biker henchmen, propelling a man into a spiraling, surreal rampage of vengeance.",
    director_id: panos.id
)

# CampaignSubs

CampaignSub.create!(
    user_id: cage.id,
    campaign_id: adaptation.id,
    is_director: false
)

CampaignSub.create!(
    user_id: cage.id,
    campaign_id: mandy.id,
    is_director: false
)

CampaignSub.create!(
    user_id: andrea.id,
    campaign_id: mandy.id,
    is_director: false
)

CampaignSub.create!(
    user_id: testman.id,
    campaign_id: adaptation.id,
    is_director: false
)

CampaignSub.create!(
    user_id: spike.id,
    campaign_id: adaptation.id,
    is_director: true
)

CampaignSub.create!(
    user_id: spike.id,
    campaign_id: season.id,
    is_director: true
)

CampaignSub.create!(
    user_id: panos.id,
    campaign_id: mandy.id,
    is_director: true
)

# Invites

Invite.create!(
    requester: season,
    requested: cage
)

Invite.create!(
    requester: andrea,
    requested: season
)

Invite.create!(
    requester: adaptation,
    requested: testman
)

Invite.create!(
    requester: adaptation,
    requested: andrea
)

Invite.create!(
    requester: spike,
    requested: season
)

# Characters

Character.create!(
    name: "Red Miller",
    user_id: cage.id,
    campaign_id: mandy.id,
    c_class: "Ragesmasher",
    race_string: "Human",
    race_traits: "Human",
    background: "Lumberjack",
    appearance: "Bloody",
    derp: "Screams in the bathroom",
    health: 7,
    plot_points: 2,
    selected_fighting_skill: "Brute Force",
    trained_skills: "[\"Macgyver\"]",
    current_specials: "{}",
    inventory: "[\"Mace\",\"Paint\",\"Blacksmith's tools\",\"Scroll of Understanding\",\"Tripwire\",\"Horn\",\"Tripwire\",\"Tripwire\"]"
)

Character.create!(
    name: "Charlie Kaufman",
    user_id: cage.id,
    campaign_id: adaptation.id,
    c_class: "Minstrel",
    race_string: "Charlie Kaufman",
    race_traits: "[\"Fireproof\",\"Slippery\"]",
    background: "Screenwriter",
    appearance: "Nerdy",
    derp: "In love with Meryl Streep",
    health: 7,
    plot_points: 3,
    selected_fighting_skill: "",
    trained_skills: "[\"Thinkiness\"]",
    current_specials: "{}",
    inventory: "[\"Polearm\",\"Cleric's tools\",\"Potion of Healing\",\"Grappling hook\",\"Bomb\",\"Staff\",\"Tripwire\",\"Spyglass\"]",
    dead: true
)

Character.create!(
    name: "Donald Kaufman",
    user_id: cage.id,
    campaign_id: adaptation.id,
    c_class: "Knight of Tushuze",
    race_string: "Human",
    race_traits: "[]",
    background: "Screenwriter",
    appearance: "Nerdy",
    derp: "Light of innocence",
    health: 7,
    plot_points: 0,
    selected_fighting_skill: "Brute Force",
    trained_skills: "[\"Believe In Yourself\"]",
    current_specials: "{}",
    inventory: "[\"Polearm\",\"Shield\",\"Potion of Healing\",\"Lockpicks\",\"Spyglass\",\"Hourglass\",\"Torch\",\"Chakram\"]",
    dead: true
)

Character.create!(
    name: "Mandy Bloom",
    user_id: andrea.id,
    campaign_id: mandy.id,
    c_class: "Verbpriest",
    race_string: "Goggler",
    race_traits: "[\"Keen hearing\",\"Underdweller\"]",
    background: "Astronomer",
    appearance: "Wacky",
    derp: "Bad at cult-fighting",
    health: 7,
    plot_points: 0,
    selected_fighting_skill: "",
    trained_skills: "[\"Believe in Yourself\",\"Creepin'\"]",
    current_specials: "{}",
    inventory: "[\"Beatstick\",\"Recurve bow\",\"Holy Symbol of Rad Moves\",\"Medicine\",\"Horn\",\"Musical instrument\",\"Stablehand tools\",\"Rope (50 ft.)\"]"
)
