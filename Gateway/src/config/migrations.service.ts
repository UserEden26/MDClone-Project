import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getConfig } from './orm.config'; // Adjust the import path

@Injectable()
export class MigrationService implements OnModuleInit {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource(getConfig());
  }

  async onModuleInit() {
    await this.dataSource.initialize();
    await this.dataSource.runMigrations();
  }
}
