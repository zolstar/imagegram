import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createCommentTable1633773941515 implements MigrationInterface {
  private tableName = 'comments';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'content',
            type: 'varchar',
          },
          {
            name: 'creatorId',
            type: 'varchar',
          },
          {
            name: 'postId',
            type: 'varchar',
          },
          {
            default: 'now()',
            name: 'createdAt',
            type: 'timestamp',
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['creatorId'],
        referencedTableName: 'accounts',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
