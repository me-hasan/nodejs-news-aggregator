import { Controller, Get, Query, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ArticleService } from './article/article.service';
import { FeedService } from './feed/feed.service';
import { TopicService } from './topic/topic.service';

interface FetchArticlesDto {
  urls: string[];
}

@Controller('articles') // Base route for articles
export class AppController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly feedService: FeedService,
    private readonly topicService: TopicService,
  ) {}

  /**
   * Fetch all articles
   */
  @Get()
  async getAllArticles() {
    try {
      const articles = await this.articleService.getAllArticles();
      return { message: 'Articles retrieved successfully', articles };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve articles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Fetch filtered articles
   * @param keyword Keyword to filter articles
   * @param startDate Start date for filtering articles
   * @param endDate End date for filtering articles
   */
  @Get('filter')
  async filterArticles(
    @Query('keyword') keyword?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const articles = await this.articleService.filterArticles(keyword, startDate, endDate);
      return { message: 'Filtered articles retrieved successfully', articles };
    } catch (error) {
      throw new HttpException(
        'Failed to filter articles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Manually fetch and process articles from RSS feeds
   * @param feeds List of feed URLs
   */
  @Post('fetch')
  async fetchArticles(@Body() feeds: FetchArticlesDto) {
    if (!feeds.urls || !feeds.urls.length) {
      throw new HttpException(
        'No feed URLs provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const articles = await this.feedService.fetchArticles(feeds.urls);

      // Process articles to extract topics and named entities
      const processedArticles = articles.map((article) => ({
        ...article,
        topics: this.topicService.extractTopics(article.description).join(', '),
        namedEntities: this.topicService
          .extractNamedEntities(article.description)
          .join(', '),
      }));

      // Save articles to the database
      await this.articleService.saveArticles(processedArticles);

      return { message: 'Articles fetched and saved successfully', articles: processedArticles };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch and save articles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Analyze text for topics and named entities
   * @param text Text to analyze
   */
  @Get('analyze')
  async analyzeArticle(@Query('text') text: string) {
    if (!text) {
      throw new HttpException('Text is required for analysis', HttpStatus.BAD_REQUEST);
    }

    try {
      const topics = this.topicService.extractTopics(text);
      const namedEntities = this.topicService.extractNamedEntities(text);
      return { message: 'Text analyzed successfully', topics, namedEntities };
    } catch (error) {
      throw new HttpException(
        'Failed to analyze text',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
