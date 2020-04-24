class AddTimestampsToCharacters < ActiveRecord::Migration[6.0]
  def change
    add_timestamps :characters, null: true

    Character.update_all(created_at: DateTime.now, updated_at: DateTime.now)

    change_column_null :characters, :created_at, false
    change_column_null :characters, :updated_at, false
  end
end
