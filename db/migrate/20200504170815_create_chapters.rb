class CreateChapters < ActiveRecord::Migration[6.0]
  def change
    create_table :chapters do |t|
      t.integer :campaign_id, null: false
      t.string :title
      t.text :description
      t.datetime :start_time
      t.datetime :end_time
      t.timestamps
    end
  end
end
