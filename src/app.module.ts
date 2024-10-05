import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './db/typrormConfig';
import { PropertiesModule } from './Modules/properties/properties.module';
import { JwtModule } from '@nestjs/jwt';
import { InquiryModule } from './Modules/inquiry/inquiry.module';
import { AdminModule } from './Modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeormConfig),
    UserModule,
    PropertiesModule,
    AdminModule,
    InquiryModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
