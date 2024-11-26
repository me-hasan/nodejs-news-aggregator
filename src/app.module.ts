import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedModule } from './feed/feed.module';
import { ArticleModule } from './article/article.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TopicModule } from './topic/topic.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'news.db',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Automatically load entities
      synchronize: true, // Disable in production
    }),
    ScheduleModule.forRoot(),
    FeedModule,
    ArticleModule,
    TopicModule,
  ],
})
export class AppModule {}
