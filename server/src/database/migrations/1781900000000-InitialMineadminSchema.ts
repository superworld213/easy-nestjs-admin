import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMineadminSchema1781900000000 implements MigrationInterface {
  name = 'InitialMineadminSchema1781900000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`user\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`username\` varchar(20) NOT NULL,
        \`password\` varchar(100) NOT NULL,
        \`user_type\` varchar(3) NOT NULL DEFAULT '100',
        \`nickname\` varchar(30) NOT NULL DEFAULT '',
        \`phone\` varchar(11) NOT NULL DEFAULT '',
        \`email\` varchar(50) NOT NULL DEFAULT '',
        \`avatar\` varchar(255) NOT NULL DEFAULT '',
        \`signed\` varchar(255) NOT NULL DEFAULT '',
        \`status\` tinyint NOT NULL DEFAULT 1,
        \`login_ip\` varchar(45) NOT NULL DEFAULT '127.0.0.1',
        \`login_time\` datetime NULL,
        \`backend_setting\` json NULL,
        \`created_by\` bigint NOT NULL DEFAULT 0,
        \`updated_by\` bigint NOT NULL DEFAULT 0,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`remark\` varchar(255) NOT NULL DEFAULT '',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_user_username\` (\`username\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`auth_token\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`user_id\` bigint NOT NULL,
        \`session_id\` varchar(64) NOT NULL,
        \`token_hash\` char(64) NOT NULL,
        \`token_type\` varchar(20) NOT NULL,
        \`expires_at\` datetime NOT NULL,
        \`revoked_at\` datetime NULL,
        \`last_used_at\` datetime NULL,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`remark\` varchar(255) NOT NULL DEFAULT '',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_auth_token_hash\` (\`token_hash\`),
        KEY \`IDX_auth_token_user_id\` (\`user_id\`),
        KEY \`IDX_auth_token_session_id\` (\`session_id\`),
        KEY \`IDX_auth_token_expires_at\` (\`expires_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`attachment\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`storage_mode\` varchar(20) NOT NULL DEFAULT 'local',
        \`origin_name\` varchar(255) NULL,
        \`object_name\` varchar(100) NULL,
        \`hash\` varchar(64) NULL,
        \`mime_type\` varchar(255) NULL,
        \`storage_path\` varchar(100) NULL,
        \`suffix\` varchar(20) NULL,
        \`size_byte\` bigint NULL,
        \`size_info\` varchar(50) NULL,
        \`url\` varchar(255) NULL,
        \`created_by\` bigint NOT NULL DEFAULT 0,
        \`updated_by\` bigint NOT NULL DEFAULT 0,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`remark\` varchar(255) NOT NULL DEFAULT '',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_attachment_hash\` (\`hash\`),
        KEY \`IDX_attachment_storage_path\` (\`storage_path\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`data_permission_policy\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`user_id\` bigint NOT NULL DEFAULT 0,
        \`position_id\` bigint NOT NULL DEFAULT 0,
        \`policy_type\` varchar(20) NOT NULL,
        \`is_default\` tinyint NOT NULL DEFAULT 1,
        \`value\` json NULL,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` datetime NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`department\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`name\` varchar(50) NOT NULL,
        \`parent_id\` bigint NOT NULL DEFAULT 0,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` datetime NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`dept_leader\` (
        \`dept_id\` bigint NOT NULL,
        \`user_id\` bigint NOT NULL,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` datetime NULL,
        PRIMARY KEY (\`dept_id\`, \`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`menu\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`parent_id\` bigint NOT NULL DEFAULT 0,
        \`name\` varchar(50) NOT NULL DEFAULT '',
        \`meta\` json NULL,
        \`path\` varchar(60) NOT NULL DEFAULT '',
        \`component\` varchar(150) NOT NULL DEFAULT '',
        \`redirect\` varchar(100) NOT NULL DEFAULT '',
        \`status\` tinyint NOT NULL DEFAULT 1,
        \`sort\` smallint NOT NULL DEFAULT 0,
        \`created_by\` bigint NOT NULL DEFAULT 0,
        \`updated_by\` bigint NOT NULL DEFAULT 0,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`remark\` varchar(255) NOT NULL DEFAULT '',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_menu_name\` (\`name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`position\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`name\` varchar(50) NOT NULL,
        \`dept_id\` bigint NOT NULL,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` datetime NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`role\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`name\` varchar(30) NOT NULL,
        \`code\` varchar(100) NOT NULL,
        \`status\` tinyint NOT NULL DEFAULT 1,
        \`sort\` smallint NOT NULL DEFAULT 0,
        \`created_by\` bigint NOT NULL DEFAULT 0,
        \`updated_by\` bigint NOT NULL DEFAULT 0,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`remark\` varchar(255) NOT NULL DEFAULT '',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_role_code\` (\`code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`role_belongs_menu\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`role_id\` bigint NOT NULL,
        \`menu_id\` bigint NOT NULL,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_role_belongs_menu_role_id\` (\`role_id\`),
        KEY \`IDX_role_belongs_menu_menu_id\` (\`menu_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`user_belongs_role\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`user_id\` bigint NOT NULL,
        \`role_id\` bigint NOT NULL,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_user_belongs_role_user_id\` (\`user_id\`),
        KEY \`IDX_user_belongs_role_role_id\` (\`role_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`user_dept\` (
        \`user_id\` bigint NOT NULL,
        \`dept_id\` bigint NOT NULL,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` datetime NULL,
        PRIMARY KEY (\`user_id\`, \`dept_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`user_position\` (
        \`user_id\` bigint NOT NULL,
        \`position_id\` bigint NOT NULL,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` datetime NULL,
        PRIMARY KEY (\`user_id\`, \`position_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`user_login_log\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`username\` varchar(20) NOT NULL,
        \`ip\` varchar(45) NULL,
        \`os\` varchar(255) NULL,
        \`browser\` varchar(255) NULL,
        \`status\` smallint NOT NULL DEFAULT 1,
        \`message\` varchar(50) NULL,
        \`login_time\` datetime NOT NULL,
        \`remark\` varchar(255) NULL,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_user_login_log_username\` (\`username\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`user_operation_log\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`username\` varchar(20) NOT NULL,
        \`method\` varchar(20) NOT NULL,
        \`router\` varchar(500) NOT NULL,
        \`service_name\` varchar(80) NOT NULL,
        \`ip\` varchar(45) NULL,
        \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`remark\` varchar(255) NULL,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_user_operation_log_username\` (\`username\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.safeAlter(queryRunner, 'ALTER TABLE `attachment` MODIFY `object_name` varchar(100) NULL');
    await this.safeAlter(queryRunner, 'ALTER TABLE `user_operation_log` MODIFY `service_name` varchar(80) NOT NULL');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `auth_token`');
    await queryRunner.query('DROP TABLE IF EXISTS `user_operation_log`');
    await queryRunner.query('DROP TABLE IF EXISTS `user_login_log`');
    await queryRunner.query('DROP TABLE IF EXISTS `user_position`');
    await queryRunner.query('DROP TABLE IF EXISTS `user_dept`');
    await queryRunner.query('DROP TABLE IF EXISTS `user_belongs_role`');
    await queryRunner.query('DROP TABLE IF EXISTS `role_belongs_menu`');
    await queryRunner.query('DROP TABLE IF EXISTS `role`');
    await queryRunner.query('DROP TABLE IF EXISTS `position`');
    await queryRunner.query('DROP TABLE IF EXISTS `menu`');
    await queryRunner.query('DROP TABLE IF EXISTS `dept_leader`');
    await queryRunner.query('DROP TABLE IF EXISTS `department`');
    await queryRunner.query('DROP TABLE IF EXISTS `data_permission_policy`');
    await queryRunner.query('DROP TABLE IF EXISTS `attachment`');
    await queryRunner.query('DROP TABLE IF EXISTS `user`');
  }

  private async safeAlter(queryRunner: QueryRunner, sql: string): Promise<void> {
    try {
      await queryRunner.query(sql);
    } catch {
      // Existing developer databases may be ahead of the initial migration.
    }
  }
}
