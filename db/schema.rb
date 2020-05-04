# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_04_170815) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "campaign_subs", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "campaign_id", null: false
    t.string "favorite_tags", default: "[]"
    t.boolean "is_director"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["campaign_id"], name: "index_campaign_subs_on_campaign_id"
    t.index ["user_id", "campaign_id"], name: "index_campaign_subs_on_user_id_and_campaign_id", unique: true
    t.index ["user_id"], name: "index_campaign_subs_on_user_id"
  end

  create_table "campaigns", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.integer "director_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["title", "director_id"], name: "index_campaigns_on_title_and_director_id", unique: true
    t.index ["title"], name: "index_campaigns_on_title"
  end

  create_table "chapters", force: :cascade do |t|
    t.integer "campaign_id", null: false
    t.string "title"
    t.text "description"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "characters", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "campaign_id"
    t.string "name", null: false
    t.string "c_class", null: false
    t.string "race_string", default: "Human"
    t.text "race_traits", null: false
    t.string "background", null: false
    t.string "appearance", null: false
    t.string "derp", null: false
    t.integer "health", null: false
    t.integer "max_health", default: 7
    t.integer "plot_points", null: false
    t.string "selected_fighting_skill", null: false
    t.text "trained_skills", null: false
    t.text "current_specials", null: false
    t.text "inventory", null: false
    t.integer "level", default: 1
    t.integer "experience", default: 0
    t.text "advancements", default: "[]"
    t.string "saved_tag"
    t.boolean "regulation"
    t.boolean "dead"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["campaign_id"], name: "index_characters_on_campaign_id"
    t.index ["name", "campaign_id"], name: "index_characters_on_name_and_campaign_id", unique: true
    t.index ["user_id"], name: "index_characters_on_user_id"
  end

  create_table "friendships", force: :cascade do |t|
    t.integer "first_id", null: false
    t.integer "second_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["first_id", "second_id"], name: "index_friendships_on_first_id_and_second_id", unique: true
  end

  create_table "invites", force: :cascade do |t|
    t.boolean "viewed"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "requester_type"
    t.bigint "requester_id"
    t.string "requested_type"
    t.bigint "requested_id"
    t.index ["requested_id"], name: "index_invites_on_requested_id"
    t.index ["requested_type", "requested_id"], name: "index_invites_on_requested_type_and_requested_id"
    t.index ["requester_id"], name: "index_invites_on_requester_id"
    t.index ["requester_type", "requester_id", "requested_type", "requested_id"], name: "index_invites_unique_combinations", unique: true
    t.index ["requester_type", "requester_id"], name: "index_invites_on_requester_type_and_requester_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "session_token", null: false
    t.string "profile_image_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email"
    t.index ["username"], name: "index_users_on_username"
  end

end
