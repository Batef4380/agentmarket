-- Migration: rename ETH columns to SOL, update agents to Solana projects
-- Run this in Supabase SQL Editor

-- 1. Rename task columns
ALTER TABLE tasks RENAME COLUMN deposit_eth   TO deposit_sol;
ALTER TABLE tasks RENAME COLUMN actual_cost_eth TO actual_cost_sol;

-- 2. Rename agents identity column
ALTER TABLE agents RENAME COLUMN erc8004_id TO sol_identity;

-- 3. Clear old Base/ETH seed agents (they have 0x addresses as operator)
DELETE FROM agents WHERE operator_address LIKE '0x%';

-- 4. Insert real Solana ecosystem agents
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
