-- Stovera Supabase Schema
-- Run this in the Supabase SQL editor

-- ─── AGENTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agents (
  id                 TEXT PRIMARY KEY,           -- slug, e.g. "web-scraper-pro"
  name               TEXT NOT NULL,
  description        TEXT NOT NULL,
  long_description   TEXT,
  category           TEXT NOT NULL DEFAULT 'General',
  price_label        TEXT NOT NULL,              -- e.g. "0.001 ETH / 10 min"
  deposit_multiplier NUMERIC NOT NULL DEFAULT 1.5,
  operator_address   TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('verified', 'pending', 'rejected')),
  submitter_address  TEXT,
  trust_score        NUMERIC NOT NULL DEFAULT 0,
  erc8004_id         TEXT,                              -- ERC-8004 global identity: eip155:{chainId}:{registry}:{agentId}
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TASKS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  task_id_bytes32   TEXT NOT NULL UNIQUE,        -- 0x-prefixed keccak256 from frontend
  agent_id          TEXT NOT NULL REFERENCES agents(id),
  user_address      TEXT NOT NULL,
  operator_address  TEXT NOT NULL,
  deposit_eth       NUMERIC NOT NULL,            -- in ETH (not wei)
  actual_cost_eth   NUMERIC,
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'executing', 'completed', 'cancelled')),
  tx_hash_deposit   TEXT,
  tx_hash_complete  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ
);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  agent_id      TEXT NOT NULL REFERENCES agents(id),
  user_address  TEXT NOT NULL,
  task_id       TEXT REFERENCES tasks(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tasks_user       ON tasks(user_address);
CREATE INDEX IF NOT EXISTS idx_tasks_agent      ON tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_bytes32    ON tasks(task_id_bytes32);
CREATE INDEX IF NOT EXISTS idx_reviews_agent    ON reviews(agent_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user     ON reviews(user_address);
CREATE INDEX IF NOT EXISTS idx_agents_status    ON agents(status);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE agents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read verified agents
CREATE POLICY "agents_read_verified" ON agents
  FOR SELECT USING (status = 'verified');

-- Anyone can read tasks (needed for frontend polling)
CREATE POLICY "tasks_read_all" ON tasks
  FOR SELECT USING (true);

-- Anyone can insert a task (deposit event from frontend)
CREATE POLICY "tasks_insert_all" ON tasks
  FOR INSERT WITH CHECK (true);

-- Only service role can update tasks (operator completing/cancelling)
CREATE POLICY "tasks_update_service" ON tasks
  FOR UPDATE USING (true);

-- Anyone can read reviews
CREATE POLICY "reviews_read_all" ON reviews
  FOR SELECT USING (true);

-- Anyone can insert a review
CREATE POLICY "reviews_insert_all" ON reviews
  FOR INSERT WITH CHECK (true);

-- ─── SEED VERIFIED AGENTS ────────────────────────────────────────────────────
-- These mirror the agentDetails.ts hardcoded data so the DB is the source of truth
INSERT INTO agents (id, name, description, category, price_label, deposit_multiplier, operator_address, status, trust_score, erc8004_id)
VALUES
  ('web-scraper-pro',   'Web Scraper Pro',      'Extracts structured data from any website',                    'Data',      '0.001 ETH / 10 min',  1.5, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 98, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:1'),
  ('contract-auditor',  'Contract Auditor',      'Audits Solidity smart contracts for vulnerabilities',          'Security',  '0.005 ETH / 30 min',  2.0, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 96, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:2'),
  ('market-analyst',    'Market Analyst',        'Analyzes crypto market trends and generates reports',          'Finance',   '0.002 ETH / 15 min',  1.5, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 94, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:3'),
  ('code-reviewer',     'Code Reviewer',         'Reviews pull requests and suggests improvements',              'Dev',       '0.003 ETH / 20 min',  1.5, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 97, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:4'),
  ('nft-appraiser',     'NFT Appraiser',         'Estimates NFT value based on rarity and market data',          'Finance',   '0.001 ETH / 5 min',   1.5, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 91, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:5'),
  ('tweet-bot',         'Tweet Bot',             'Generates and schedules crypto-native Twitter/X content',      'Social',    '0.0005 ETH / 5 min',  1.5, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 88, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:6'),
  ('defi-optimizer',    'DeFi Optimizer',        'Finds optimal yield farming and liquidity strategies',         'Finance',   '0.004 ETH / 20 min',  2.0, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 95, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:7'),
  ('doc-generator',     'Doc Generator',         'Generates documentation from code or specs',                   'Dev',       '0.002 ETH / 10 min',  1.5, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 93, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:8'),
  ('wallet-analyst',    'Wallet Analyst',        'Analyzes on-chain wallet behavior and history',                'Security',  '0.001 ETH / 10 min',  1.5, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 90, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:9'),
  ('news-summarizer',   'News Summarizer',       'Summarizes latest crypto / web3 news',                         'Data',      '0.0005 ETH / 3 min',  1.5, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 89, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:10'),
  ('ens-resolver',      'ENS Resolver',          'Resolves ENS names and reverse-lookup wallet addresses',       'Data',      '0.0002 ETH / 1 min',  2.0, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 99, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:11'),
  ('gas-tracker',       'Gas Tracker',           'Monitors gas prices and alerts when optimal for transaction',  'Data',      '0.0003 ETH / 2 min',  2.0, '0x88E6Da13Ab4699566b7ED412dEce223614eC38C6', 'verified', 97, 'eip155:8453:0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7:12')
ON CONFLICT (id) DO NOTHING;
