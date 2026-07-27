import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
        setAsked(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('A network error occurred. Please try again.');
    }
    setLoading(false);
  }

  function askAnother() {
    setQuestion('');
    setAnswer('');
    setError('');
  }

  return (
    <>
      <Head>
        <title>Ask SimpliScope — Questions Answered</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="wrap">
        <div className="card">
          <div className="badge">SimpliScope Q&amp;A</div>
          <h1>Ask us anything about SimpliScope</h1>
          <p className="subtitle">
            Type your question below — pricing, what's included, refunds, access, anything.
            You'll get a straight answer in a few seconds.
          </p>

          <form onSubmit={handleAsk}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What's included in a SimpliScope report?"
              rows={3}
              disabled={loading}
            />
            <button className="btn-primary" type="submit" disabled={loading || !question.trim()}>
              {loading ? 'Thinking…' : 'Ask'}
            </button>
          </form>

          {error && <div className="error-box">{error}</div>}

          {answer && (
            <div className="answer-box">
              <div className="answer-label">Answer</div>
              <p>{answer}</p>
            </div>
          )}

          {asked && !loading && (
            <div className="footer-row">
              <button className="btn-secondary" onClick={askAnother}>Ask another question</button>
              <a className="btn-link" href="https://simpliscope.io" target="_blank" rel="noreferrer">
                Visit SimpliScope →
              </a>
            </div>
          )}

          {!asked && (
            <div className="footer-row footer-row-quiet">
              <a className="btn-link" href="https://simpliscope.io" target="_blank" rel="noreferrer">
                Already know enough? Visit SimpliScope →
              </a>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: #16140f;
          color: #f4f1ea;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif;
        }
      `}</style>
      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .card {
          background: #f4f1ea;
          color: #1a1a1a;
          border-radius: 18px;
          padding: 40px;
          max-width: 560px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,.35);
        }
        .badge {
          display: inline-block;
          background: #e7a940;
          color: #1a1a1a;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          margin-bottom: 16px;
        }
        h1 {
          font-size: 26px;
          font-weight: 700;
          margin: 0 0 10px;
          line-height: 1.25;
        }
        .subtitle {
          font-size: 14px;
          color: #5b5648;
          line-height: 1.6;
          margin: 0 0 22px;
        }
        textarea {
          width: 100%;
          padding: 14px;
          border: 1px solid #d8d3c3;
          border-radius: 10px;
          font-size: 15px;
          font-family: inherit;
          resize: vertical;
          background: #fff;
          color: #1a1a1a;
        }
        .btn-primary {
          margin-top: 12px;
          width: 100%;
          padding: 13px;
          background: #1a1a1a;
          color: #f4f1ea;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-primary:disabled { opacity: .55; cursor: default; }

        .error-box {
          margin-top: 16px;
          padding: 12px 14px;
          background: #fbe9e9;
          color: #a13c3c;
          border-radius: 8px;
          font-size: 13px;
        }

        .answer-box {
          margin-top: 20px;
          padding: 18px;
          background: #fff;
          border: 1px solid #e4dfd0;
          border-radius: 12px;
        }
        .answer-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: #9a8d5f;
          margin-bottom: 8px;
        }
        .answer-box p {
          margin: 0;
          font-size: 15px;
          line-height: 1.65;
          color: #1a1a1a;
        }

        .footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 22px;
          flex-wrap: wrap;
        }
        .footer-row-quiet { justify-content: flex-end; margin-top: 16px; }
        .btn-secondary {
          padding: 9px 16px;
          background: none;
          border: 1px solid #d8d3c3;
          border-radius: 8px;
          font-size: 13px;
          color: #1a1a1a;
          cursor: pointer;
        }
        .btn-link {
          font-size: 13px;
          color: #b3791f;
          font-weight: 600;
          text-decoration: none;
        }
        .btn-link:hover { text-decoration: underline; }
      `}</style>
    </>
  );
}
