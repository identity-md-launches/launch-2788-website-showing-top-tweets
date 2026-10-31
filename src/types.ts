export type Topic = 'All topics' | 'Building' | 'Community' | 'AI agents' | 'Ecosystem';

export interface Post {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  date: string;
  excerpt: string;
  topic: Exclude<Topic, 'All topics'>;
  likes: number;
  reposts: number;
  replies: number;
  url: string;
  searchText: string;
}
