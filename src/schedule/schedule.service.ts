import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FeedService } from '../feed/feed.service';
import { ArticleService } from '../article/article.service';
import { TopicService } from '../topic/topic.service';
import * as feeds from '../feed/feeds';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly feedService: FeedService,
    private readonly articleService: ArticleService,
    private readonly topicService: TopicService,
  ) {}

  @Cron('0 */5 * * * *') // Runs every 5 minutes
  async handleCron() {
    const articles = await this.feedService.fetchArticles(feeds.urls);

    articles.forEach((article) => {
      article.topics = this.topicService.extractTopics(article.description).join(', ');
      article.namedEntities = this.topicService
        .extractNamedEntities(article.description)
        .join(', ');
    });

    await this.articleService.saveArticles(articles);
    console.log('Articles fetched and stored!');
  }
}
