import { useMemo, useRef, useState } from 'react';
import { Search, ChevronDown, ExternalLink, X } from 'lucide-react';
import {
  articles,
  categories,
  featured,
  mission,
  type Article,
  type Category,
} from '../learnContent';
import AskPanel from './AskPanel';

// All the text in an article, lowercased, so search can match anything in it
function searchableText(a: Article): string {
  const parts: string[] = [a.title, a.category, ...a.intro];
  for (const s of a.sections) {
    parts.push(s.question, ...s.paragraphs, ...(s.bullets ?? []), ...(s.closing ?? []));
  }
  return parts.join(' ').toLowerCase();
}

const SEARCH_INDEX = new Map(articles.map((a) => [a.id, searchableText(a)]));

export default function LearnView() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [openId, setOpenId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const q = query.trim().toLowerCase();

  const visible = useMemo(() => {
    return articles.filter((a) => {
      if (category !== 'All' && a.category !== category) return false;
      if (!q) return true;
      // Every word in the search has to appear somewhere in the article
      const text = SEARCH_INDEX.get(a.id) ?? '';
      return q.split(/\s+/).every((word) => text.includes(word));
    });
  }, [q, category]);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  // Open one article and scroll to it (used by the featured card and the
  // question box)
  function openArticle(id: string) {
    setQuery('');
    setCategory('All');
    setOpenId(id);
    // Wait a frame so the card is rendered and expanded before scrolling to it
    requestAnimationFrame(() => {
      cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const showFeatured = !q && category === 'All';

  return (
    <div style={page}>
      <h1 style={heading}>Knowledge Base</h1>

      {/* Search */}
      <div style={searchBox}>
        <Search size={18} color="#8a978c" style={{ flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for articles, tips, or guides..."
          style={searchInput}
          aria-label="Search articles"
        />
        {query && (
          <button onClick={() => setQuery('')} style={clearButton} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div style={chipRow}>
        {(['All', ...categories] as const).map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                ...chip,
                background: active ? '#14301f' : '#ffffff',
                color: active ? '#ffffff' : '#14301f',
                borderColor: active ? '#14301f' : '#d6e2d6',
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Questions, answered from the articles on this device */}
      {showFeatured && <AskPanel onOpenArticle={openArticle} />}

      {/* Featured */}
      {showFeatured && (
        <button onClick={() => openArticle(featured.articleId)} style={featuredCard}>
          <span style={featuredTag}>{featured.tag}</span>
          <div style={featuredTitle}>{featured.title}</div>
          <p style={featuredBody}>{featured.body}</p>
          <span style={featuredLink}>Read the guide →</span>
        </button>
      )}

      {/* Articles */}
      {q && (
        <p style={resultCount}>
          {visible.length === 0
            ? 'No articles match your search.'
            : `${visible.length} article${visible.length === 1 ? '' : 's'} found`}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {visible.map((a) => {
          const open = openId === a.id;
          const Icon = a.Icon;
          return (
            <div
              key={a.id}
              ref={(el) => {
                cardRefs.current[a.id] = el;
              }}
              style={{ ...card, scrollMarginTop: 16 }}
            >
              <button onClick={() => toggle(a.id)} style={cardHeader} aria-expanded={open}>
                <span style={iconTile}>
                  <Icon size={22} color="#2f6b3f" />
                </span>
                <span style={{ flex: 1, textAlign: 'left' }}>
                  <span style={cardTitle}>{a.title}</span>
                  {category === 'All' && <span style={cardCategory}>{a.category}</span>}
                </span>
                <ChevronDown
                  size={20}
                  color="#5a6b5e"
                  style={{
                    flexShrink: 0,
                    transition: 'transform 0.2s',
                    transform: open ? 'rotate(180deg)' : 'none',
                  }}
                />
              </button>

              {open && (
                <div style={cardBody}>
                  {a.intro.map((p, i) => (
                    <p key={i} style={paragraph}>
                      {p}
                    </p>
                  ))}

                  {a.sections.map((s, i) => (
                    <div key={i} style={{ marginTop: 22 }}>
                      <h3 style={question}>{s.question}</h3>
                      {s.paragraphs.map((p, j) => (
                        <p key={j} style={paragraph}>
                          {p}
                        </p>
                      ))}
                      {s.bullets && (
                        <ul style={bulletList}>
                          {s.bullets.map((b, j) => (
                            <li key={j} style={{ marginBottom: 6 }}>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                      {s.closing?.map((p, j) => (
                        <p key={j} style={paragraph}>
                          {p}
                        </p>
                      ))}
                    </div>
                  ))}

                  {a.sources.length > 0 && (
                    <div style={sourcesBox}>
                      <div style={sourcesTitle}>Sources</div>
                      {a.sources.map((s) => (
                        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={sourceLink}>
                          <ExternalLink size={13} style={{ flexShrink: 0, marginTop: 3 }} />
                          <span>{s.label}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <p style={disclaimer}>
                    This article is general information, not medical advice. If you're worried
                    about your back, talk to a doctor.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mission */}
      <div style={{ marginTop: 40 }}>
        <h2 style={missionTitle}>{mission.title}</h2>
        <p style={{ ...paragraph, color: '#14301f' }}>{mission.body}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {mission.tags.map((t) => (
            <span key={t} style={tag}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- styles ----
const page: React.CSSProperties = {
  padding: '24px 20px 40px',
  maxWidth: 560,
  margin: '0 auto',
};

const heading: React.CSSProperties = {
  fontSize: 34,
  fontWeight: 800,
  color: '#14301f',
  margin: '0 0 18px',
  lineHeight: 1.15,
};

const searchBox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: '#ffffff',
  borderRadius: 28,
  padding: '12px 16px',
  border: '1px solid #e0e8e0',
};

const searchInput: React.CSSProperties = {
  flex: 1,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  font: 'inherit',
  fontSize: 15,
  color: '#14301f',
  minWidth: 0,
};

const clearButton: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: '#8a978c',
  cursor: 'pointer',
  padding: 2,
  display: 'flex',
};

const chipRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  overflowX: 'auto',
  padding: '14px 0 4px',
  scrollbarWidth: 'none',
};

const chip: React.CSSProperties = {
  flexShrink: 0,
  border: '1px solid',
  borderRadius: 20,
  padding: '7px 14px',
  font: 'inherit',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const featuredCard: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  background: '#dcefdc',
  border: 'none',
  borderRadius: 24,
  padding: '26px 22px',
  margin: '16px 0 24px',
  font: 'inherit',
  cursor: 'pointer',
};

const featuredTag: React.CSSProperties = {
  display: 'inline-block',
  background: '#14301f',
  color: '#ffffff',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.5,
  borderRadius: 12,
  padding: '4px 10px',
};

const featuredTitle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: '#14301f',
  margin: '14px 0 8px',
  lineHeight: 1.25,
};

const featuredBody: React.CSSProperties = {
  fontSize: 15,
  color: '#3d5a45',
  lineHeight: 1.6,
  margin: 0,
};

const featuredLink: React.CSSProperties = {
  display: 'inline-block',
  marginTop: 14,
  fontSize: 14,
  fontWeight: 700,
  color: '#14301f',
};

const resultCount: React.CSSProperties = {
  fontSize: 13,
  color: '#8a978c',
  margin: '14px 0 10px',
};

const card: React.CSSProperties = {
  background: '#f6f8f6',
  borderRadius: 22,
  overflow: 'hidden',
};

const cardHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  width: '100%',
  padding: '18px 18px',
  background: 'transparent',
  border: 'none',
  font: 'inherit',
  cursor: 'pointer',
};

const iconTile: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  background: '#d9efd9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const cardTitle: React.CSSProperties = {
  display: 'block',
  fontSize: 17,
  fontWeight: 600,
  color: '#14301f',
  lineHeight: 1.3,
};

const cardCategory: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#8a978c',
  marginTop: 3,
};

const cardBody: React.CSSProperties = {
  padding: '0 20px 22px',
  textAlign: 'left',
};

const question: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: '#14301f',
  margin: '0 0 6px',
  lineHeight: 1.35,
};

const paragraph: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: '#3a4a3e',
  margin: '0 0 12px',
};

const bulletList: React.CSSProperties = {
  margin: '0 0 12px',
  paddingLeft: 22,
  fontSize: 15,
  lineHeight: 1.6,
  color: '#3a4a3e',
};

const sourcesBox: React.CSSProperties = {
  marginTop: 24,
  paddingTop: 16,
  borderTop: '1px solid #e0e8e0',
};

const sourcesTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: 'uppercase',
  color: '#8a978c',
  marginBottom: 8,
};

const sourceLink: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  fontSize: 13,
  lineHeight: 1.5,
  color: '#2f6b3f',
  textDecoration: 'none',
  marginBottom: 8,
};

const disclaimer: React.CSSProperties = {
  fontSize: 12,
  fontStyle: 'italic',
  color: '#8a978c',
  margin: '16px 0 0',
  lineHeight: 1.5,
};

const missionTitle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  color: '#14301f',
  margin: '0 0 10px',
};

const tag: React.CSSProperties = {
  background: '#d9efd9',
  color: '#14301f',
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 14,
  padding: '6px 12px',
};  