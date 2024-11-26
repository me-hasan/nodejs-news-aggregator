import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Marks this class as a database entity
export class Article {
  @PrimaryGeneratedColumn() // Auto-generated unique identifier
  id: number;

  @Column() // Maps this property to a database column
  title: string;

  @Column()
  description: string;

  @Column()
  pubDate: string;

  @Column()
  sourceUrl: string;

  @Column({ nullable: true }) // Nullable column for topics
  topics: string;

  @Column({ nullable: true }) // Nullable column for named entities
  namedEntities: string;
}
