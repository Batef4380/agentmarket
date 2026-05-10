export const STOVERA_ESCROW_ADDRESS = "0xAc0B3EdC31f653b4A3EF7bB21146C67748128fc7" as const;

export const STOVERA_ESCROW_ABI = [
  {
    "type": "function",
    "name": "depositForTask",
    "inputs": [
      { "name": "taskId", "type": "bytes32" },
      { "name": "agentOperator", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "cancelTask",
    "inputs": [{ "name": "taskId", "type": "bytes32" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "completeTask",
    "inputs": [
      { "name": "taskId", "type": "bytes32" },
      { "name": "actualCost", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getTask",
    "inputs": [{ "name": "taskId", "type": "bytes32" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          { "name": "user", "type": "address" },
          { "name": "agentOperator", "type": "address" },
          { "name": "deposit", "type": "uint256" },
          { "name": "actualCost", "type": "uint256" },
          { "name": "status", "type": "uint8" },
          { "name": "createdAt", "type": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "TaskCreated",
    "inputs": [
      { "name": "taskId", "type": "bytes32", "indexed": true },
      { "name": "user", "type": "address", "indexed": true },
      { "name": "agentOperator", "type": "address", "indexed": true },
      { "name": "deposit", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "TaskCompleted",
    "inputs": [
      { "name": "taskId", "type": "bytes32", "indexed": true },
      { "name": "actualCost", "type": "uint256", "indexed": false },
      { "name": "refunded", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "TaskCancelled",
    "inputs": [
      { "name": "taskId", "type": "bytes32", "indexed": true },
      { "name": "refunded", "type": "uint256", "indexed": false }
    ]
  }
] as const;

// Placeholder operator address — her agent için gerçek operator set edilecek
// Şu an deploy wallet'ı operator (0x88E6Da13Ab4699566b7ED412dEce223614eC38C6)
export const DEFAULT_OPERATOR = "0x88E6Da13Ab4699566b7ED412dEce223614eC38C6" as const;

export enum TaskStatus {
  Pending = 0,
  Executing = 1,
  Completed = 2,
  Cancelled = 3,
}
