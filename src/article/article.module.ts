import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleRepository])],
  providers: [ArticleService],
  exports: [ArticleService], // Export if other modules depend on ArticleService
})
export class ArticleModule {}
