import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleRepository } from './article.repository';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleRepository)
    private readonly articleRepository: ArticleRepository, // Use the custom repository here
  ) {}

  // Save articles to the database
  async saveArticles(articles: Partial<Article>[]): Promise<void> {
    const newArticles = articles.map((article) =>
      this.articleRepository.create(article),
    );
    await this.articleRepository.save(newArticles);
  }

  // Get all articles
  async getAllArticles(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  // Filter articles based on keyword and date range
  async filterArticles(
    keyword?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Article[]> {
    const query = this.articleRepository.createQueryBuilder('article');
    if (keyword) {
      query.andWhere('article.description LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }
    if (startDate) {
      query.andWhere('article.pubDate >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('article.pubDate <= :endDate', { endDate });
    }
    return query.getMany();
  }
}
