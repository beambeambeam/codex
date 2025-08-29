-- Initialize database with required extensions
-- This script runs automatically when the container starts for the first time

-- Create the vector extension for pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Optional: Verify the extension was created
-- SELECT * FROM pg_extension WHERE extname = 'vector';
