import { Injectable } from '@nestjs/common';
import * as RSSParser from 'rss-parser';

@Injectable()
export class FeedService {
  private parser: RSSParser;

  constructor() {
    this.parser = new RSSParser();
  }

  async fetchArticles(feedUrls: string[]): Promise<any[]> {
    const articles = [];
    for (const url of feedUrls) {
      try {
        const feed = await this.parser.parseURL(url);
        feed.items.forEach((item) =>
          articles.push({
            title: item.title,
            description: item.contentSnippet,
            pubDate: item.pubDate,
            sourceUrl: item.link,
          }),
        );
      } catch (error) {
        console.error(`Failed to fetch ${url}:`, error.message);
      }
    }
    return articles;
  }
}
