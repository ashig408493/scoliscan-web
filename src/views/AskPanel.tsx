import { useEffect, useRef, useState } from 'react';
import { MessageCircleQuestion, Send, BookOpen, AlertTriangle } from 'lucide-react';
import { ask, SUGGESTIONS, type Answer } from '../AskEngine';

type Message = { id: number; question: string; answer: Answer };

type Props = {
  onOpenArticle: (articleId: string) => void;
};

export default function AskPanel({ onOpenArticle }: Props) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length > 0) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  function submit(text: string) {
    const question = text.trim();
    if (!question) return;
    setMessages((m) => [...m, { id: nextId.current++, question, answer: ask(question) }]);
    setInput('');
  }

  return (
    <div style={panel}>
      <div style={header}>
        <span style={iconTile}>
          <MessageCircleQuestion size={22} color="#2f6b3f" />
        </span>
        <div>
          <div style={panelTitle}>Ask a question</div>
          <div style={panelSub}>Answers come from the articles in this app, found right on your device.</div>
        </div>
      </div>

      {messages.length === 0 && (
        <div style={suggestionRow}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => submit(s)} style={suggestion}>
              {s}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div style={thread}>
          {messages.map((m) => (
            <div key={m.id}>
              <div style={userBubble}>{m.question}</div>
              <AnswerBubble answer={m.answer} onOpenArticle={onOpenArticle} />
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        style={inputRow}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Can I play sports with scoliosis?"
          style={textInput}
          aria-label="Ask a question about scoliosis"
        />
        <button type="submit" style={sendButton} aria-label="Ask" disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

function AnswerBubble({ answer, onOpenArticle }: { answer: Answer; onOpenArticle: (id: string) => void }) {
  return (
    <div style={botBubble}>
      {answer.notes.map((n) => (
        <div key={n} style={noteBox}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{n}</span>
        </div>
      ))}

      {answer.kind === 'none' ? (
        <p style={answerText}>
          I couldn't find that in the articles. Try asking in a different way, or browse the topics
          below. For questions about your own back, a doctor is the best person to ask.
        </p>
      ) : (
        <>
          {answer.best.section.question !== answer.best.article.title && (
            <div style={answerHeading}>{answer.best.section.question}</div>
          )}
          {answer.best.section.paragraphs.slice(0, 2).map((p, i) => (
            <p key={i} style={answerText}>
              {p}
            </p>
          ))}
          {answer.best.section.bullets && (
            <ul style={bulletList}>
              {answer.best.section.bullets.map((b, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  {b}
                </li>
              ))}
            </ul>
          )}

          <button onClick={() => onOpenArticle(answer.best.article.id)} style={sourceButton}>
            <BookOpen size={15} style={{ flexShrink: 0 }} />
            <span>From “{answer.best.article.title}” · read the full article</span>
          </button>

          {answer.related.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={relatedLabel}>Related</div>
              {answer.related.map((r) => (
                <button key={r.article.id} onClick={() => onOpenArticle(r.article.id)} style={relatedLink}>
                  {r.article.title} →
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---- styles ----
const panel: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 24,
  padding: 18,
  margin: '16px 0 8px',
  border: '1px solid #e0e8e0',
};

const header: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center' };

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

const panelTitle: React.CSSProperties = { fontSize: 17, fontWeight: 700, color: '#14301f' };

const panelSub: React.CSSProperties = { fontSize: 12.5, color: '#8a978c', marginTop: 2, lineHeight: 1.4 };

const suggestionRow: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 };

const suggestion: React.CSSProperties = {
  border: '1px solid #d6e2d6',
  background: '#f6f8f6',
  color: '#14301f',
  borderRadius: 16,
  padding: '7px 12px',
  font: 'inherit',
  fontSize: 13,
  cursor: 'pointer',
  textAlign: 'left',
};

const thread: React.CSSProperties = {
  marginTop: 14,
  maxHeight: 420,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const userBubble: React.CSSProperties = {
  marginLeft: 'auto',
  maxWidth: '85%',
  width: 'fit-content',
  background: '#14301f',
  color: '#ffffff',
  borderRadius: '18px 18px 4px 18px',
  padding: '10px 14px',
  fontSize: 14.5,
  lineHeight: 1.45,
  marginBottom: 8,
};

const botBubble: React.CSSProperties = {
  maxWidth: '92%',
  background: '#eef5ee',
  borderRadius: '18px 18px 18px 4px',
  padding: '12px 14px',
  textAlign: 'left',
};

const answerHeading: React.CSSProperties = { fontSize: 14.5, fontWeight: 700, color: '#14301f', marginBottom: 6 };

const answerText: React.CSSProperties = { fontSize: 14, lineHeight: 1.65, color: '#3a4a3e', margin: '0 0 8px' };

const bulletList: React.CSSProperties = {
  margin: '0 0 8px',
  paddingLeft: 20,
  fontSize: 14,
  lineHeight: 1.55,
  color: '#3a4a3e',
};

const noteBox: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  background: '#fdf1e3',
  color: '#7a3e12',
  borderRadius: 12,
  padding: '9px 11px',
  fontSize: 13,
  lineHeight: 1.5,
  marginBottom: 10,
};

const sourceButton: React.CSSProperties = {
  font: 'inherit',
  display: 'flex',
  gap: 6,
  alignItems: 'flex-start',
  border: 'none',
  background: 'transparent',
  color: '#2f6b3f',
  fontWeight: 600,
  fontSize: 13,
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
  lineHeight: 1.45,
};

const relatedLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: 'uppercase',
  color: '#8a978c',
  marginBottom: 4,
};

const relatedLink: React.CSSProperties = {
  font: 'inherit',
  display: 'block',
  border: 'none',
  background: 'transparent',
  color: '#2f6b3f',
  fontSize: 13,
  padding: '3px 0',
  cursor: 'pointer',
  textAlign: 'left',
};

const inputRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 14,
  alignItems: 'center',
};

const textInput: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: '1px solid #d6e2d6',
  borderRadius: 22,
  padding: '11px 16px',
  font: 'inherit',
  fontSize: 15,
  color: '#14301f',
  outline: 'none',
  background: '#f6f8f6',
};

const sendButton: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 22,
  border: 'none',
  background: '#bfe8bf',
  color: '#14301f',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
};