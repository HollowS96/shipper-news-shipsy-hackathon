import { Module } from '@nestjs/common';
import { RootController } from './root/root.controller';
import { NewsModule } from './news/news.module';
import { RootService } from './root/root.service';
import { ConfigModule } from './config/config.module';
import { CommentModule } from './comments/comments.module';

@Module({
  imports: [NewsModule,ConfigModule,CommentModule],
  controllers: [RootController],
  providers : [RootService],
})
export class AppModule {}
