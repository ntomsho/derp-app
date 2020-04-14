class InvitePolymorphicReferences < ActiveRecord::Migration[6.0]
  def change
    remove_column :invites, :requester_id
    remove_column :invites, :requested_id

    add_reference :invites, :requester, polymorphic: true
    add_reference :invites, :requested, polymorphic: true
  end
end
