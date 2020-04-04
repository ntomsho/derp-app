class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :username, null: false, unique: true
      t.string :email, null: false, unique: true
      t.string :password_digest, null: false
      t.string :session_token, null: false
      t.string :profile_image_url
      t.timestamps
    end
    
    create_table :campaigns do |t|
      t.string :title, null: false
      t.text :description
      t.integer :director_id
      t.timestamps
    end

    create_table :campaign_subs do |t|
      t.integer :user_id, null: false
      t.integer :campaign_id, null: false
      t.string :favorite_tags, default: "[]"
      t.boolean :is_director
      t.timestamps
    end

    create_table :characters do |t|
      t.integer :user_id, null: false
      t.integer :campaign_id, null: false
      t.string :name, null: false
      t.string :c_class, null: false
      t.string :race_string, default: "Human"
      t.text :race_traits, null: false
      t.string :background, null: false
      t.string :appearance, null: false
      t.string :derp, null: false
      t.integer :health, null: false
      t.integer :max_health, default: 7
      t.integer :plot_points, null: false
      t.string :selected_fighting_skill, null: false
      t.text :trained_skills, null: false
      t.text :current_specials, null: false
      t.text :inventory, null: false
      t.integer :level, default: 1
      t.integer :experience, default: 0
      t.text :advancements, default: "[]"
      t.string :saved_tag
      t.boolean :regulation
    end

    add_index :users, :email
    add_index :characters, :user_id
    add_index :characters, :campaign_id
  end
end
