import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/shared/entities/User.entity';
import { CryptoUtility } from 'src/shared/utils/crypto.utility';
import { MailService } from 'src/shared/utils/mail-service.utility';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './Guards/roles.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [UserService, CryptoUtility, MailService, JwtStrategy, RolesGuard],
  controllers: [UserController],
})
export class UserModule {}
