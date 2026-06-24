# RoughNote

## Live Link: [RoughNote](https://roughnote.vercel.app/)

RoughNote is a journaling app, which helps people reflect on their journey. Users can track their
moods, create collections for specific areas of life, example: Personal and Career etc. This app is
for anyone who wants to live a more meaningful and fuller life.
A dedicated Mood Tracking feature with graphical Visualization!

## Tech Stack: Next.js, Clerk, Prisma, NeonDB, Arcjet, OpenAI SDK

## Key Features:

- Dedicated Dashboard with Mood Visualization Graph and overall statistics
- Option to create collections for different aspects of your life
- A Rich editor with a toolbar for making your journals extra beautiful
- Mood tracking system
### **Key AI features**
- **Assistant (LLM):** an API-backed conversational assistant for writing help and reflection. See [app/api/assistant/route.js](app/api/assistant/route.js).

**Primary focus:** the AI assistant and the Retrieval-Augmented Generation (RAG) pipeline.

**Why AI here:** the app augments journaling with context-aware suggestions, RAG-enabled search across entries, and a chat-style assistant for reflection and insights.

- **RAG pipeline:** embeddings + vector search + LLM prompting to ground responses in your journal data (implemented in [actions/agents/rag/embeddings.js](actions/agents/rag/embeddings.js) and [actions/agents/rag/searchEntries.js](actions/agents/rag/searchEntries.js)).
- **Per-user rate limiting:** request throttling is handled via Arcjet in [lib/arcjet.js](lib/arcjet.js) (default: 10 calls per user per hour).

RAG pipeline (high level)

- Indexing: journal entries are converted to embeddings and stored in a vector index.
- Retrieval: on user query, the app searches the vector index to fetch the most relevant entry passages.
- Augmentation: retrieved passages are prepended to the LLM prompt so responses are grounded in the user's own content.
- Generation: the assistant generates answers, summaries, or suggestions using the augmented prompt.

Where to look in the code

- **AI entrypoint:** [app/api/assistant/route.js](app/api/assistant/route.js)
- **RAG helpers:** [actions/agents/rag/embeddings.js](actions/agents/rag/embeddings.js), [actions/agents/rag/searchEntries.js](actions/agents/rag/searchEntries.js)
- **Rate limiting:** [lib/arcjet.js](lib/arcjet.js)
- **DB schema:** [prisma/schema.prisma](prisma/schema.prisma)

Environment variables

- **ARCJET_KEY** — Arcjet rate-limiting key (see [lib/arcjet.js](lib/arcjet.js)).
- **DATABASE_URL** — Prisma/Postgres connection string (see [prisma/schema.prisma](prisma/schema.prisma)).
- **OPENAI_API_KEY** (or other LLM provider key) — required if using a hosted LLM for the assistant.

Running locally

- Install dependencies:

```bash
npm install
```

- Start dev server:

```bash
npm run dev
```

Quick notes and recommendations

- The RAG pipeline is intentionally modular: you can swap the embedding model, vector store, or prompt template in the `actions/agents/rag/*` helpers.
- Keep sensitive API keys in environment variables — do not commit them.
- Arcjet in `lib/arcjet.js` currently limits users to 10 requests per hour by default; adjust tokenBucket settings if you need a different quota.
