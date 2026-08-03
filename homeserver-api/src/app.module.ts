import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { FileController } from './file/file.controller';
import { FolderController } from './folder/folder.controller';
import { AuthService } from './auth/auth.service';
import { FolderService } from './folder/folder.service';
import { FileService } from './file/file.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, PrismaModule, MailModule],
  controllers: [AppController, AuthController, FileController, FolderController],
  providers: [AppService, AuthService, FolderService, FileService],
})
export class AppModule {}
