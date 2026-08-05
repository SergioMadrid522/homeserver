import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FileModule } from './file/file.module';
import { FolderModule } from './folder/folder.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    MailModule,
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 }, //max 3 attemps in a second
      { name: 'medium', ttl: 10000, limit: 5 }, //max 5 attemps in 10 seconds
      { name: 'long', ttl: 300000, limit: 10 }, //max 5 attemps in 5 minutes
    ]),
    FileModule,
    FolderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
