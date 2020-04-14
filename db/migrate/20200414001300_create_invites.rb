class CreateInvites < ActiveRecord::Migration[6.0]
  def change
    create_table :invites do |t|
      t.integer :requester_id, null: false
      t.integer :requested_id, null: false
      t.boolean :viewed
      t.timestamps
    end

    create_table :friendships do |t|
      t.integer :first_id, null: false
      t.integer :second_id, null: false
      t.timestamps
    end

    add_column :characters, :dead, :boolean

    add_index :friendships, [:first_id, :second_id], unique: true
  end
end
