import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig, { getConfig } from './config/orm.config';
import { EmployeeModule } from './modules/employee/employee.module';
import { ReportModule } from './modules/report/report.module';
import { TaskModule } from './modules/task/task.module';
import { EmployeesRlationsModule } from './modules/employees-relations/employees-relations.module';
import { AuthMiddleware } from './common/middlewares/authentication.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { CustomCacheModule } from './modules/cache/cache.module';
import { MigrationService } from './config/migrations.service'; // Import the migration service

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => getConfig(),
    }),
    CustomCacheModule,
    EmployeesRlationsModule,
    EmployeeModule,
    TaskModule,
    ReportModule,
    AuthModule,
  ],
  providers: [MigrationService], // Add MigrationService here
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth/login', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
