-- Stovera Supabase Schema (Solana)
-- Run this in the Supabase SQL editor

-- ─── AGENTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agents (
  id                 TEXT PRIMARY KEY,           -- slug, e.g. "eliza-agent"
  name               TEXT NOT NULL,
  description        TEXT NOT NULL,
  long_description   TEXT,
  category           TEXT NOT NULL DEFAULT 'General',
  price_label        TEXT NOT NULL,              -- e.g. "0.001 SOL / 10 min"
  deposit_multiplier NUMERIC NOT NULL DEFAULT 1.5,
  operator_address   TEXT NOT NULL,              -- Solana pubkey (base58)
  status             TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('verified', 'pending', 'rejected')),
  submitter_address  TEXT,
  trust_score        NUMERIC NOT NULL DEFAULT 0,
  sol_identity       TEXT,                       -- 8004-Solana: solana:{cluster}:{programId}:{agentId}
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TASKS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  task_id_bytes32   TEXT NOT NULL UNIQUE,        -- hex-encoded sha256 task ID from frontend
  agent_id          TEXT NOT NULL REFERENCES agents(id),
  user_address      TEXT NOT NULL,               -- Solana pubkey (base58)
  operator_address  TEXT NOT NULL,               -- Solana pubkey (base58)
  deposit_sol       NUMERIC NOT NULL,            -- in SOL (not lamports)
  actual_cost_sol   NUMERIC,
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'executing', 'completed', 'cancelled')),
  tx_hash_deposit   TEXT,                        -- Solana tx signature
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

CREATE POLICY "agents_read_verified" ON agents FOR SELECT USING (status = 'verified');
CREATE POLICY "tasks_read_all"       ON tasks  FOR SELECT USING (true);
CREATE POLICY "tasks_insert_all"     ON tasks  FOR INSERT WITH CHECK (true);
CREATE POLICY "tasks_update_service" ON tasks  FOR UPDATE USING (true);
CREATE POLICY "reviews_read_all"     ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_all"   ON reviews FOR INSERT WITH CHECK (true);

-- ─── SEED VERIFIED AGENTS (real Solana ecosystem projects) ───────────────────
-- Operator: HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2 (devnet deployer)
INSERT INTO agents (id, name, description, category, price_label, deposit_multiplier, operator_address, status, trust_score, sol_identity)
VALUES
  ('eliza-agent',       'ELIZA',              'Autonomous AI agent framework by elizaOS, runs on any chain',         'AI Framework', '0.002 SOL / 10 min',  1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:eliza-agent'),
  ('drift-vaults',      'Drift Protocol',     'Decentralized perpetuals and spot trading on Solana',                 'DeFi',         '0.003 SOL / 15 min',  1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:drift-vaults'),
  ('birdeye-analytics', 'Birdeye',            'Real-time token analytics and price intelligence for Solana',         'Analytics',    '0.001 SOL / 5 min',   1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:birdeye-analytics'),
  ('helius-webhooks',   'Helius',             'Solana RPC, webhooks, and data indexing infrastructure',              'Development',  '0.002 SOL / 10 min',  1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:helius-webhooks'),
  ('jito-bundle-bot',   'Jito',               'MEV-protected transaction bundles and block engine on Solana',        'DeFi',         '0.005 SOL / 20 min',  2.0, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:jito-bundle-bot'),
  ('jupiter-dca',       'Jupiter DCA',        'Dollar-cost averaging and swap aggregation on Solana',                'DeFi',         '0.002 SOL / 10 min',  1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:jupiter-dca'),
  ('ottersec-auditor',  'OtterSec Auditor',   'Automated Anchor program security analysis by OtterSec methodology',  'Security',     '0.01 SOL / 30 min',   2.0, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:ottersec-auditor'),
  ('tensor-sniper',     'Tensor',             'NFT marketplace and sniping on Solana with real-time floor data',     'NFT',          '0.001 SOL / 5 min',   1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:tensor-sniper'),
  ('pyth-oracle',       'Pyth Network',       'High-fidelity on-chain price feeds for DeFi applications',            'Analytics',    '0.001 SOL / 3 min',   1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:pyth-oracle'),
  ('dialect-blinks',    'Dialect',            'Solana Blinks and on-chain messaging protocol',                        'Social',       '0.001 SOL / 5 min',   1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:dialect-blinks'),
  ('meteora-lp-bot',    'Meteora',            'Dynamic liquidity vaults and DLMM pools on Solana',                   'DeFi',         '0.003 SOL / 15 min',  1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:meteora-lp-bot'),
  ('hivemapper-agent',  'Hivemapper',         'Decentralized mapping network rewarding contributors on Solana',       'DePIN',        '0.002 SOL / 10 min',  1.5, 'HfBqx5KGYKgPWpUJDx7azjsqL3FiLbvrSY92mnbg9ik2', 'verified', 0, 'solana:devnet:8EzedGwvmUsYh9nqdVfzBqA7bzmPf268cjfd3ME7Ckka:hivemapper-agent')
ON CONFLICT (id) DO NOTHING;
