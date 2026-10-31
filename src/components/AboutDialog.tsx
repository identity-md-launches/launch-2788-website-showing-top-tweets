import { useEffect, useRef } from 'react';
import Icon from './Icon';
import { SNAPSHOT_DATE, posts } from '../posts';

export default function AboutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (open && element && !element.open) element.showModal();
    else if (!open && element?.open) element.close();
  }, [open]);

  return (
    <dialog ref={dialog} className="about-dialog" aria-labelledby="about-title" onClose={onClose} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex="0"]'));
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
      <div className="dialog-heading"><img src="./art/favicon.svg" alt="" width="36" height="36" /><button autoFocus type="button" className="icon-button" aria-label="Close about the feed" onClick={onClose}><Icon name="close" /></button></div>
      <h2 id="about-title">A little less noise.</h2>
      <p>The Swamp brings together public posts about IdentityMD and its community of AI builders.</p>
      <dl className="about-facts">
        <div><dt>The collection</dt><dd>{posts.length} selected posts. Collected on {SNAPSHOT_DATE}. This is an independent community site.</dd></div>
        <div><dt>How “Top tweets” works</dt><dd>Posts are ranked by likes + reposts + replies in this collection. Counts are a snapshot from public X pages and may have changed. This is a selection, not an exhaustive X ranking.</dd></div>
        <div><dt>Read the original</dt><dd>Cards show short excerpts. “View on X” opens the complete original post. Authors’ claims belong to their authors.</dd></div>
        <div><dt>Saved means local</dt><dd>Bookmarks stay in this browser. There is no account, syncing, tracking, or connection to your X account.</dd></div>
      </dl>
      <a className="button button-primary" href="https://x.com/search?q=%22identity.md%22%20OR%20%22IdentityMD%22%20OR%20%22Identity%20MD%22&f=top" target="_blank" rel="noreferrer">Explore the conversation<Icon name="external" size={16} /><span className="sr-only"> on X (opens new tab)</span></a>
    </dialog>
  );
}
