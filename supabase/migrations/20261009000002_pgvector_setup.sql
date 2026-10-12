-- Migration: Add pgvector and semantic search capabilities for Competencies & Skills
-- Used for AI Retrieval Augmented Generation (RAG) and semantic pathway mapping

-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add embedding columns
ALTER TABLE competencies ADD COLUMN IF NOT EXISTS embedding vector(1536);
ALTER TABLE skills ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- 3. Create HNSW indexes for fast semantic search (Cosine distance)
CREATE INDEX IF NOT EXISTS competencies_embedding_idx ON competencies USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS skills_embedding_idx ON skills USING hnsw (embedding vector_cosine_ops);

-- 4. Create an RPC function for semantic search of skills
CREATE OR REPLACE FUNCTION match_skills (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  competency_id uuid,
  code text,
  title text,
  description text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    skills.id,
    skills.competency_id,
    skills.code,
    skills.title,
    skills.description,
    1 - (skills.embedding <=> query_embedding) AS similarity
  FROM skills
  WHERE 1 - (skills.embedding <=> query_embedding) > match_threshold
  ORDER BY skills.embedding <=> query_embedding
  LIMIT match_count;
$$;
