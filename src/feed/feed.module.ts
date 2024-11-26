import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';

@Module({
  providers: [FeedService]
})
export class FeedModule {}
