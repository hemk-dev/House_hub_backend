import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { RolesGuard } from './Guards/roles.guard';
import { UserService } from './user.service';
import { MailService } from 'src/shared/utils/mail-service.utility';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/User.entity';
import { CryptoUtility } from 'src/shared/utils/crypto.utility';
import { UserController } from './user.controller';
import { AuthGuard } from './guards/auth.guard';
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, CryptoUtility, MailService, AuthGuard],
  exports: [AuthGuard],
})
export class UserModule {}
