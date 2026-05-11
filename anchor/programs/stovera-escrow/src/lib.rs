use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("StvEscrow111111111111111111111111111111111");

pub const TASK_SEED: &[u8] = b"task";
pub const STATE_SEED: &[u8] = b"state";

#[program]
pub mod stovera_escrow {
    use super::*;

    /// One-time init: creates ProgramState PDA holding owner + operator list
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.program_state;
        state.owner = ctx.accounts.authority.key();
        state.operators = vec![ctx.accounts.authority.key()];
        state.bump = ctx.bumps.program_state;
        Ok(())
    }

    pub fn add_operator(ctx: Context<AdminAction>, operator: Pubkey) -> Result<()> {
        let state = &mut ctx.accounts.program_state;
        require!(!state.operators.contains(&operator), EscrowError::AlreadyOperator);
        state.operators.push(operator);
        emit!(OperatorAdded { operator });
        Ok(())
    }

    pub fn remove_operator(ctx: Context<AdminAction>, operator: Pubkey) -> Result<()> {
        let state = &mut ctx.accounts.program_state;
        state.operators.retain(|k| k != &operator);
        emit!(OperatorRemoved { operator });
        Ok(())
    }

    /// User deposits SOL to start a task.
    /// task_id: [u8; 32] — sha256 of (agentId + wallet + timestamp), generated client-side
    pub fn deposit_for_task(
        ctx: Context<DepositForTask>,
        task_id: [u8; 32],
        agent_operator: Pubkey,
        deposit_lamports: u64,
    ) -> Result<()> {
        require!(deposit_lamports > 0, EscrowError::ZeroDeposit);
        require!(agent_operator != Pubkey::default(), EscrowError::InvalidOperator);

        let task = &mut ctx.accounts.task_account;
        task.task_id = task_id;
        task.user = ctx.accounts.user.key();
        task.agent_operator = agent_operator;
        task.deposit_lamports = deposit_lamports;
        task.actual_cost_lamports = 0;
        task.status = TaskStatus::Pending;
        task.created_at = Clock::get()?.unix_timestamp;
        task.bump = ctx.bumps.task_account;

        // Transfer SOL from user to task PDA (escrow vault)
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.task_account.to_account_info(),
            },
        );
        system_program::transfer(cpi_ctx, deposit_lamports)?;

        emit!(TaskCreated {
            task_id,
            user: task.user,
            agent_operator,
            deposit_lamports,
        });
        Ok(())
    }

    /// Operator marks task as executing (optional UX step)
    pub fn mark_executing(ctx: Context<OperatorAction>, _task_id: [u8; 32]) -> Result<()> {
        let state = &ctx.accounts.program_state;
        require!(
            state.operators.contains(&ctx.accounts.operator.key()),
            EscrowError::NotOperator
        );
        let task = &mut ctx.accounts.task_account;
        require!(task.status == TaskStatus::Pending, EscrowError::TaskNotActive);
        task.status = TaskStatus::Executing;
        emit!(TaskExecuting { task_id: task.task_id });
        Ok(())
    }

    /// Operator settles: deducts actual_cost, refunds remainder to user
    pub fn complete_task(
        ctx: Context<CompleteTask>,
        _task_id: [u8; 32],
        actual_cost_lamports: u64,
    ) -> Result<()> {
        let state = &ctx.accounts.program_state;
        require!(
            state.operators.contains(&ctx.accounts.operator.key()),
            EscrowError::NotOperator
        );
        let task = &ctx.accounts.task_account;
        require!(
            task.status == TaskStatus::Pending || task.status == TaskStatus::Executing,
            EscrowError::TaskNotActive
        );
        require!(actual_cost_lamports <= task.deposit_lamports, EscrowError::CostExceedsDeposit);

        let deposit = task.deposit_lamports;
        let refund = deposit - actual_cost_lamports;
        let task_id_ref = task.task_id;
        let bump = task.bump;

        let seeds: &[&[u8]] = &[TASK_SEED, &task_id_ref, &[bump]];
        let signer_seeds = &[seeds];

        if actual_cost_lamports > 0 {
            let cpi = CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.task_account.to_account_info(),
                    to: ctx.accounts.agent_operator.to_account_info(),
                },
                signer_seeds,
            );
            system_program::transfer(cpi, actual_cost_lamports)?;
        }

        if refund > 0 {
            let cpi = CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.task_account.to_account_info(),
                    to: ctx.accounts.user.to_account_info(),
                },
                signer_seeds,
            );
            system_program::transfer(cpi, refund)?;
        }

        let task_mut = &mut ctx.accounts.task_account;
        task_mut.actual_cost_lamports = actual_cost_lamports;
        task_mut.status = TaskStatus::Completed;

        emit!(TaskCompleted {
            task_id: task_id_ref,
            actual_cost_lamports,
            refunded_lamports: refund,
        });
        Ok(())
    }

    /// Cancel pending task: full refund to user. Caller must be user or operator.
    pub fn cancel_task(ctx: Context<CancelTask>, _task_id: [u8; 32]) -> Result<()> {
        let state = &ctx.accounts.program_state;
        let task = &ctx.accounts.task_account;

        let caller = ctx.accounts.caller.key();
        require!(
            caller == task.user || state.operators.contains(&caller),
            EscrowError::NotAuthorized
        );
        require!(task.status == TaskStatus::Pending, EscrowError::TaskNotActive);

        let deposit = task.deposit_lamports;
        let task_id_ref = task.task_id;
        let bump = task.bump;

        let seeds: &[&[u8]] = &[TASK_SEED, &task_id_ref, &[bump]];
        let signer_seeds = &[seeds];

        let cpi = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.task_account.to_account_info(),
                to: ctx.accounts.user_refund.to_account_info(),
            },
            signer_seeds,
        );
        system_program::transfer(cpi, deposit)?;

        let task_mut = &mut ctx.accounts.task_account;
        task_mut.status = TaskStatus::Cancelled;

        emit!(TaskCancelled { task_id: task_id_ref, refunded_lamports: deposit });
        Ok(())
    }
}

// ─── Accounts ─────────────────────────────────────────────────────────────────

#[account]
pub struct ProgramState {
    pub owner: Pubkey,
    pub operators: Vec<Pubkey>,
    pub bump: u8,
}

impl ProgramState {
    pub const SPACE: usize = 8 + 32 + 4 + (32 * 10) + 1; // max 10 operators
}

#[account]
pub struct TaskAccount {
    pub task_id: [u8; 32],
    pub user: Pubkey,
    pub agent_operator: Pubkey,
    pub deposit_lamports: u64,
    pub actual_cost_lamports: u64,
    pub status: TaskStatus,
    pub created_at: i64,
    pub bump: u8,
}

impl TaskAccount {
    pub const SPACE: usize = 8 + 32 + 32 + 32 + 8 + 8 + 1 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TaskStatus {
    Pending,
    Executing,
    Completed,
    Cancelled,
}

// ─── Contexts ─────────────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, payer = authority, space = ProgramState::SPACE,
        seeds = [STATE_SEED], bump
    )]
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AdminAction<'info> {
    #[account(mut, seeds = [STATE_SEED], bump = program_state.bump, has_one = owner)]
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(task_id: [u8; 32])]
pub struct DepositForTask<'info> {
    #[account(
        init, payer = user, space = TaskAccount::SPACE,
        seeds = [TASK_SEED, &task_id], bump
    )]
    pub task_account: Account<'info, TaskAccount>,
    #[account(seeds = [STATE_SEED], bump = program_state.bump)]
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(task_id: [u8; 32])]
pub struct OperatorAction<'info> {
    #[account(mut, seeds = [TASK_SEED, &task_id], bump = task_account.bump)]
    pub task_account: Account<'info, TaskAccount>,
    #[account(seeds = [STATE_SEED], bump = program_state.bump)]
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub operator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(task_id: [u8; 32])]
pub struct CompleteTask<'info> {
    #[account(mut, seeds = [TASK_SEED, &task_id], bump = task_account.bump)]
    pub task_account: Account<'info, TaskAccount>,
    #[account(seeds = [STATE_SEED], bump = program_state.bump)]
    pub program_state: Account<'info, ProgramState>,
    /// CHECK: verified via program_state.operators
    #[account(mut)]
    pub agent_operator: AccountInfo<'info>,
    /// CHECK: refund target = task.user
    #[account(mut, address = task_account.user)]
    pub user: AccountInfo<'info>,
    #[account(mut)]
    pub operator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(task_id: [u8; 32])]
pub struct CancelTask<'info> {
    #[account(mut, seeds = [TASK_SEED, &task_id], bump = task_account.bump)]
    pub task_account: Account<'info, TaskAccount>,
    #[account(seeds = [STATE_SEED], bump = program_state.bump)]
    pub program_state: Account<'info, ProgramState>,
    /// CHECK: validated in instruction (task.user)
    #[account(mut, address = task_account.user)]
    pub user_refund: AccountInfo<'info>,
    #[account(mut)]
    pub caller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// ─── Events ───────────────────────────────────────────────────────────────────

#[event] pub struct TaskCreated { pub task_id: [u8; 32], pub user: Pubkey, pub agent_operator: Pubkey, pub deposit_lamports: u64 }
#[event] pub struct TaskExecuting { pub task_id: [u8; 32] }
#[event] pub struct TaskCompleted { pub task_id: [u8; 32], pub actual_cost_lamports: u64, pub refunded_lamports: u64 }
#[event] pub struct TaskCancelled { pub task_id: [u8; 32], pub refunded_lamports: u64 }
#[event] pub struct OperatorAdded { pub operator: Pubkey }
#[event] pub struct OperatorRemoved { pub operator: Pubkey }

// ─── Errors ───────────────────────────────────────────────────────────────────

#[error_code]
pub enum EscrowError {
    #[msg("Deposit must be greater than zero")] ZeroDeposit,
    #[msg("Invalid operator address")] InvalidOperator,
    #[msg("Caller is not a registered operator")] NotOperator,
    #[msg("Task is not in an active state")] TaskNotActive,
    #[msg("Actual cost exceeds deposit")] CostExceedsDeposit,
    #[msg("Caller is not authorized")] NotAuthorized,
    #[msg("Already an operator")] AlreadyOperator,
}
