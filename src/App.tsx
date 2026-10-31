import { useEffect, useMemo, useRef, useState } from 'react';
import Icon, { type IconName } from './components/Icon';
import PostCard from './components/PostCard';
import AboutDialog from './components/AboutDialog';
import { posts, SNAPSHOT_DATE } from './posts';
import type { Topic } from './types';

const STORAGE_KEY = 'the-swamp:saved:v1';
const topics: { name: Topic; icon: IconName; description: string }[] = [
  { name: 'Building', icon: 'code', description: 'From idea to shipped' },
  { name: 'AI agents', icon: 'chip', description: 'Intelligence at work' },
  { name: 'Community', icon: 'community', description: 'The people behind the swarm' },
  { name: 'Ecosystem', icon: 'grid', description: 'Around IdentityMD' },
];
const engagement = (post: typeof posts[number]) => post.likes + post.reposts + post.replies;
const rankedPosts = [...posts].sort((a, b) => engagement(b) - engagement(a) || b.date.localeCompare(a.date));
const ranks = new Map(rankedPosts.map((post, index) => [post.id, index + 1]));
const people = Array.from(new Map(posts.map(post => [post.handle, post])).values());

function readBookmarks(): { ids: string[]; storageAvailable: boolean } {
  let value: string | null;
  try {
    value = localStorage.getItem(STORAGE_KEY);
  } catch { return { ids: [], storageAvailable: false }; }
  try {
    const raw: unknown = JSON.parse(value || '[]');
    return { ids: Array.isArray(raw) ? [...new Set(raw.filter((id): id is string => typeof id === 'string' && ranks.has(id)))] : [], storageAvailable: true };
  } catch { return { ids: [], storageAvailable: true }; }
}

export default function App() {
  const [initial] = useState(readBookmarks);
  const [savedIds, setSavedIds] = useState(initial.ids);
  const [storageAvailable, setStorageAvailable] = useState(initial.storageAvailable);
  const [view, setView] = useState<'feed' | 'saved'>(() => location.hash === '#saved' ? 'saved' : 'feed');
  const [sort, setSort] = useState<'top' | 'latest'>('top');
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<Topic>('All topics');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [limit, setLimit] = useState(6);
  const feedRef = useRef<HTMLElement>(null);
  const aboutTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function updateView() {
      setView(location.hash === '#saved' ? 'saved' : 'feed');
      setQuery(''); setTopic('All topics'); setLimit(6);
      if (location.hash === '#saved') requestAnimationFrame(() => feedRef.current?.scrollIntoView({ block: 'start' }));
    }
    window.addEventListener('hashchange', updateView);
    return () => window.removeEventListener('hashchange', updateView);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds)); }
    catch { setStorageAvailable(false); }
  }, [savedIds]);

  const filteredPosts = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return posts.filter(post =>
      (view === 'feed' || savedIds.includes(post.id)) &&
      (topic === 'All topics' || post.topic === topic) &&
      (!search || `${post.excerpt} ${post.author} ${post.handle} ${post.topic} ${post.searchText}`.toLocaleLowerCase().includes(search)),
    ).sort((a, b) => sort === 'top' ? engagement(b) - engagement(a) || b.date.localeCompare(a.date) : b.date.localeCompare(a.date));
  }, [query, topic, sort, view, savedIds]);

  const visiblePosts = filteredPosts.slice(0, limit);
  const totalLikes = posts.reduce((total, post) => total + post.likes, 0);

  function toggleSave(id: string) {
    const isSaved = savedIds.includes(id);
    const next = isSaved ? savedIds.filter(saved => saved !== id) : [...savedIds, id];
    setSavedIds(next);
    setAnnouncement(`${isSaved ? 'Post removed from saved.' : 'Post saved.'} ${next.length} saved ${next.length === 1 ? 'post' : 'posts'}.`);
    if (view === 'saved' && isSaved) requestAnimationFrame(() => (document.querySelector<HTMLElement>('.post-card .save-button') || document.querySelector<HTMLElement>('.empty-state a'))?.focus());
  }

  function filterTopic(next: Topic, scroll = false) {
    setTopic(next); setLimit(6);
    if (scroll) feedRef.current?.scrollIntoView({ block: 'start' });
  }

  function openAbout() {
    aboutTrigger.current = document.activeElement as HTMLElement;
    setAboutOpen(true);
  }

  function closeAbout() {
    setAboutOpen(false);
    // Wait until React closes the native dialog before restoring the invoking control.
    requestAnimationFrame(() => aboutTrigger.current?.focus());
  }

  function resetFilters() { setQuery(''); setTopic('All topics'); setLimit(6); }

  return (
    <>
      <a className="skip-link" href="#feed" onClick={event => { event.preventDefault(); feedRef.current?.focus(); feedRef.current?.scrollIntoView({ block: 'start' }); }}>Skip to the feed</a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="brand" aria-label="The Swamp home"><img src="./art/favicon.svg" alt="" width="36" height="36" /><span>the swamp<span className="brand-dot">.</span></span></a>
          <nav className="main-nav" aria-label="Main navigation"><a className={view === 'feed' ? 'nav-active' : ''} href="#feed" aria-current={view === 'feed' ? 'page' : undefined}>The feed</a><button type="button" onClick={openAbout}>About the Swamp</button></nav>
          <div className="header-actions"><a className={`saved-nav ${view === 'saved' ? 'nav-active' : ''}`} href="#saved" aria-label={`Saved posts, ${savedIds.length}`} aria-current={view === 'saved' ? 'page' : undefined}><Icon name="bookmark" size={19} /><span className="saved-label">Saved</span>{savedIds.length > 0 && <span className="saved-count">{savedIds.length}</span>}</a><a className="button header-x" href="https://x.com/search?q=%22identity.md%22%20OR%20%22IdentityMD%22%20OR%20%22Identity%20MD%22&f=top" target="_blank" rel="noreferrer"><Icon name="x" size={15} />Join the conversation<Icon name="external" size={14} /><span className="sr-only"> on X (opens new tab)</span></a></div>
        </div>
      </header>

      <main className="page-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy"><h1 id="hero-title">The swamp<br />has <span>signal.</span></h1><p>Top tweets from the IdentityMD ecosystem.</p><a className="button button-primary" href="#feed" onClick={() => { if (view === 'saved') { setView('feed'); resetFilters(); } }}>Explore the feed<Icon name="arrowDown" size={17} /></a></div>
          <img className="hero-art" src="./art/swamp-agents.svg" alt="Two Pepe agents in tactical gear with an AI-powered circuit blaster and a friendly scout drone." width="620" height="360" fetchPriority="high" />
          <span className="hero-caption"><span className="tiny-spark" aria-hidden="true">✳</span> Armed with AI. Fueled by the swarm.</span>
        </section>

        <div className="content-grid">
          <section className="feed-section" id="feed" ref={feedRef} aria-labelledby="feed-title" tabIndex={-1}>
            <div className="section-heading"><div className="feed-title-row"><h2 id="feed-title">{view === 'saved' ? 'Saved posts' : 'From the timeline'}</h2><span className="post-count">{view === 'saved' ? savedIds.length : posts.length}</span></div><button type="button" className="snapshot-info" onClick={openAbout}><span className="snapshot-dot" aria-hidden="true" />Snapshot<Icon name="info" size={14} /></button></div>
            <div className="filter-controls">
              <div className="search-field"><label htmlFor="search-posts">Search tweets</label><div className="input-wrap"><Icon name="search" size={18} /><input id="search-posts" name="search" type="search" value={query} onChange={event => { setQuery(event.target.value); setLimit(6); }} placeholder="People, topics, or keywords…" autoComplete="off" />{query && <button type="button" className="clear-search" aria-label="Clear search" onClick={() => { setQuery(''); document.getElementById('search-posts')?.focus(); }}><Icon name="close" size={16} /></button>}</div></div>
              <div className="topic-field"><label htmlFor="topic">Topic</label><select id="topic" name="topic" value={topic} onChange={event => filterTopic(event.target.value as Topic)}><option>All topics</option>{topics.map(item => <option key={item.name}>{item.name}</option>)}</select></div>
            </div>
            <div className="feed-toolbar"><div className="sort-controls" role="group" aria-label="Sort posts"><button type="button" className={sort === 'top' ? 'sort-active' : ''} aria-pressed={sort === 'top'} onClick={() => { setSort('top'); setLimit(6); }}><Icon name="flame" size={17} />Top tweets</button><button type="button" className={sort === 'latest' ? 'sort-active' : ''} aria-pressed={sort === 'latest'} onClick={() => { setSort('latest'); setLimit(6); }}><Icon name="clock" size={17} />Latest</button></div><span className="results-label" role="status" aria-live="polite">{filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}{query || topic !== 'All topics' ? ' found' : ''}</span></div>
            {view === 'saved' && <p className="saved-note"><Icon name="bookmark" size={15} />Saved in this browser. <a href="#feed">Back to the feed<Icon name="arrow" size={14} /></a></p>}
            {!storageAvailable && <p className="storage-notice" role="status">Browser storage is unavailable. Bookmarks will last for this visit.</p>}
            <div className="post-list">
              {visiblePosts.map(post => <PostCard key={post.id} post={post} rank={ranks.get(post.id)!} saved={savedIds.includes(post.id)} onSave={toggleSave} onTopic={next => filterTopic(next, true)} />)}
              {filteredPosts.length === 0 && <div className="empty-state"><div className="empty-icon"><Icon name={view === 'saved' && !savedIds.length ? 'bookmark' : 'search'} size={28} /></div><h3>{view === 'saved' && !savedIds.length ? 'Keep the good ones.' : 'No posts found.'}</h3><p>{view === 'saved' && !savedIds.length ? 'Save a post from the feed to find it here later.' : `No matches${query.trim() ? ` for “${query.trim()}”` : ''}${topic !== 'All topics' ? ` in ${topic}` : ''}. Try another search or clear your filters.`}</p>{view === 'saved' && !savedIds.length ? <a className="button button-primary" href="#feed">Explore the feed<Icon name="arrow" size={16} /></a> : <button type="button" className="button button-primary" onClick={resetFilters}>Clear filters<Icon name="close" size={16} /></button>}</div>}
            </div>
            {visiblePosts.length < filteredPosts.length && <button type="button" className="button load-more" onClick={() => { const previous = limit; setLimit(current => current + 6); setAnnouncement('More posts loaded.'); requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-post-id="${filteredPosts[previous]?.id}"] a`)?.focus()); }}>Load {Math.min(6, filteredPosts.length - visiblePosts.length)} more posts<Icon name="arrowDown" size={17} /></button>}
            {filteredPosts.length > 0 && <p className="feed-end">{visiblePosts.length < filteredPosts.length ? `${visiblePosts.length} of ${filteredPosts.length} posts` : 'You’re all caught up with this collection.'}<span>Counts captured {SNAPSHOT_DATE}.</span></p>}
          </section>

          <aside className="sidebar" aria-label="Explore the community">
            <section className="sidebar-section topics-section" aria-labelledby="topics-title"><h2 id="topics-title">Find your corner</h2><p>Big ideas. Very green energy.</p><div className="topic-list">{topics.map(item => <button type="button" key={item.name} className={`topic-row ${topic === item.name ? 'topic-selected' : ''}`} aria-pressed={topic === item.name} onClick={() => filterTopic(item.name, true)}><span className="topic-icon"><Icon name={item.icon} size={19} /></span><span className="topic-row-text"><strong>{item.name}</strong><span>{item.description}</span></span><span className="topic-number">{posts.filter(post => post.topic === item.name).length}</span></button>)}</div></section>
            <section className="sidebar-section people-section" aria-labelledby="people-title"><h2 id="people-title">People in the swamp</h2><div className="people-list">{people.map(person => <a className="person-row" key={person.handle} href={`https://x.com/${person.handle}`} target="_blank" rel="noreferrer"><img className="avatar" src={person.avatar} alt="" width="36" height="36" loading="lazy" /><span><strong>{person.author}</strong><span>@{person.handle}</span></span><Icon name="external" size={15} /><span className="sr-only"> on X (opens new tab)</span></a>)}</div></section>
            <section className="project-section" aria-labelledby="project-title"><div className="project-symbol" aria-hidden="true"><Icon name="chip" size={24} /><span>→</span><img src="./art/favicon.svg" alt="" width="32" height="32" /></div><h2 id="project-title">Small frogs.<br />Big intelligence.</h2><p>Meet IdentityMD, the network putting independent AI agents to work.</p><a href="https://imd.fun" target="_blank" rel="noreferrer">Explore IdentityMD<Icon name="arrow" size={17} /><span className="sr-only"> (opens new tab)</span></a></section>
            <div className="collection-note"><Icon name="info" size={16} /><p>A curated collection from {people.length} voices.<br />{totalLikes.toLocaleString('en')} likes at the snapshot.<br /><button type="button" onClick={openAbout}>How this feed works<Icon name="arrow" size={13} /></button></p></div>
          </aside>
        </div>
      </main>

      <footer className="site-footer page-shell"><span className="footer-brand"><img src="./art/favicon.svg" width="22" height="22" alt="" />A good place to be green.</span><span>Independent. Community-made.</span><button type="button" onClick={openAbout}>About this feed<Icon name="external" size={13} /></button></footer>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      <AboutDialog open={aboutOpen} onClose={closeAbout} />
    </>
  );
}
