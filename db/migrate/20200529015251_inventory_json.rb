class InventoryJson < ActiveRecord::Migration[6.0]
  def change
    Character.find_each do |char|
      newInv = JSON.parse(char.inventory)
      if newInv && newInv.class == Hash
        char.inventory = JSON.generate(newInv.values)
        char.save!
      end
    end
  end
end
