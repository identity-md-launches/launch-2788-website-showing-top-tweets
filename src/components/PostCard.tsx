import Icon from './Icon';
import type { Post, Topic } from '../types';

const dateFormatter = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export default function PostCard({ post, rank, saved, onSave, onTopic }: { post: Post; rank: number; saved: boolean; onSave: (id: string) => void; onTopic: (topic: Topic) => void }) {
  return (
    <article className="post-card" aria-labelledby={`author-${post.id}`} data-post-id={post.id}>
      <div className="post-heading">
        <a className="avatar-link" href={`https://x.com/${post.handle}`} target="_blank" rel="noreferrer" aria-label={`${post.author} on X (opens new tab)`}>
          <img className="avatar" src={post.avatar} alt="" width="44" height="44" loading="lazy" />
        </a>
        <div className="post-author">
          <h3 id={`author-${post.id}`}><a href={`https://x.com/${post.handle}`} target="_blank" rel="noreferrer">{post.author}<span className="sr-only"> on X (opens new tab)</span></a></h3>
          <div className="post-meta"><span>@{post.handle}</span><span aria-hidden="true">·</span><time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time></div>
        </div>
        <span className="post-rank" title="Rank by engagement in this collection">#{String(rank).padStart(2, '0')}</span>
        <Icon name="x" size={18} className="post-x" />
      </div>
      <blockquote><p>{post.excerpt}<span className="excerpt-end" aria-label="Excerpt"> …</span></p></blockquote>
      <div className="post-context"><button className="topic-tag" type="button" onClick={() => onTopic(post.topic)} aria-label={`Filter by ${post.topic}`}><Icon name="hash" size={13} />{post.topic}</button><span className="excerpt-label">Post excerpt</span></div>
      <div className="post-footer">
        <div className="post-stats" aria-label="Engagement at the snapshot date">
          <span title={`${post.replies} replies`}><Icon name="reply" size={17} /><span className="sr-only">Replies: </span>{post.replies}</span>
          <span title={`${post.reposts} reposts`}><Icon name="repost" size={18} /><span className="sr-only">Reposts: </span>{post.reposts}</span>
          <span title={`${post.likes} likes`}><Icon name="heart" size={17} /><span className="sr-only">Likes: </span>{post.likes}</span>
        </div>
        <div className="post-actions">
          <button type="button" className={`icon-button save-button ${saved ? 'is-saved' : ''}`} aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} post by ${post.author}`} onClick={() => onSave(post.id)} title={saved ? 'Remove from saved posts' : 'Save post'}><Icon name="bookmark" size={19} /></button>
          <a className="post-link" href={post.url} target="_blank" rel="noreferrer" aria-label={`View on X: post by ${post.author} (opens new tab)`}>View on X<Icon name="external" size={14} /></a>
        </div>
      </div>
    </article>
  );
}
