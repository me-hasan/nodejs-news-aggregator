import { Injectable } from '@nestjs/common';
import compromise from 'compromise'; // Corrected import

@Injectable()
export class TopicService {
  extractTopics(text: string): string[] {
    const doc = compromise(text);
    return doc.topics().out('array');
  }

  extractNamedEntities(text: string): string[] {
    const doc = compromise(text);
    return doc.people().out('array'); // You can add locations, organizations, etc.
  }
}
