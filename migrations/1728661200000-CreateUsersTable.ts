import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUsersTable1728661200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create UserType enum
    await queryRunner.query(`
      CREATE TYPE "user_type_enum" AS ENUM ('Admin', 'Player');
    `);

    // Create ItemProperty enum
    await queryRunner.query(`
      CREATE TYPE "item_property_enum" AS ENUM ('Strength', 'Agility', 'Intelligence', 'Defense', 'Speed', 'Health', 'Magic');
    `);

    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'userType',
            type: 'user_type_enum',
            isNullable: false,
            default: "'Player'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create items table
    await queryRunner.createTable(
      new Table({
        name: 'items',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'iconUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create userItems table
    await queryRunner.createTable(
      new Table({
        name: 'userItems',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userUuid',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'itemUuid',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'level',
            type: 'int',
            default: 1,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create itemProperties table
    await queryRunner.createTable(
      new Table({
        name: 'itemProperties',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'itemUuid',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'property',
            type: 'item_property_enum',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Add foreign key: userItems.userUuid -> users.uuid
    await queryRunner.createForeignKey(
      'userItems',
      new TableForeignKey({
        columnNames: ['userUuid'],
        referencedColumnNames: ['uuid'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Add foreign key: userItems.itemUuid -> items.uuid
    await queryRunner.createForeignKey(
      'userItems',
      new TableForeignKey({
        columnNames: ['itemUuid'],
        referencedColumnNames: ['uuid'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Add foreign key: itemProperties.itemUuid -> items.uuid
    await queryRunner.createForeignKey(
      'itemProperties',
      new TableForeignKey({
        columnNames: ['itemUuid'],
        referencedColumnNames: ['uuid'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Enable uuid-ossp extension for UUID generation
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys from userItems table
    const userItemsTable = await queryRunner.getTable('userItems');
    if (userItemsTable) {
      for (const foreignKey of userItemsTable.foreignKeys) {
        await queryRunner.dropForeignKey('userItems', foreignKey);
      }
    }

    // Drop foreign keys from itemProperties table
    const itemPropertiesTable = await queryRunner.getTable('itemProperties');
    if (itemPropertiesTable) {
      for (const foreignKey of itemPropertiesTable.foreignKeys) {
        await queryRunner.dropForeignKey('itemProperties', foreignKey);
      }
    }

    // Drop tables
    await queryRunner.dropTable('itemProperties');
    await queryRunner.dropTable('userItems');
    await queryRunner.dropTable('items');
    await queryRunner.dropTable('users');

    // Drop enums
    await queryRunner.query(`DROP TYPE "item_property_enum";`);
    await queryRunner.query(`DROP TYPE "user_type_enum";`);
  }
}
