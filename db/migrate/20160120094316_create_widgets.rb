Sequel.migration do
  up do
    Rails::Sequel::connection.run 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'

    create_table :widgets do
      Uuid :id, primary_key: true, default: 'uuid_generate_v4()'.lit
      # TODO: on delete cascade
      foreign_key :layer_id, :layers, type: 'uuid', null: false
      Integer :order, null: false
      String :type, null: false
      String :title
      String :dataview, null: false, type: 'json'
      DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
      DateTime :updated_at, default: Sequel::CURRENT_TIMESTAMP
    end
  end

  down do
    drop_table :widgets
  end
end
