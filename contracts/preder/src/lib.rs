// Preder ("Predict Together") — community prediction market for the World Cup, powered by TxLINE.
// Solana / Anchor. Single program, many PDA data accounts (one Market per prediction).
//
// Settlement model: KEEPER-ATTESTED (decision 2026-07-14, spec §1.4 poin 7 / SPIKE-AND-DECISIONS.md).
// The keeper verifies the TxLINE Merkle proof OFF-CHAIN via `.view()` on `validate_stat_v3`,
// then submits `settle()`. On-chain we enforce guards 0-3 (idempotency, keeper-auth,
// fixture-match, freshness) + the zero-winner branch. Guards 4-5 (on-chain CPI + return-data
// check) are intentionally dropped — direct single-tx CPI is byte-infeasible (>1232 B) for
// realistic proof depth (see SPIKE-AND-DECISIONS.md Part 2).
//
// CORE INVARIANT (spec §0 anti-regression): every condition that determines a market's FINAL
// state is checked in the SAME instruction that writes that state. `settle()` filters the
// zero-winner case into `Refundable` itself, so `state == Settled` guarantees
// total_stakes[winning] > 0 by construction — `claim()` never divides by zero.

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("xa2YjaE4f8qyae8crkfDQZV7KiwzQMSBcx56jeanyHi"); // deployed devnet 2026-07-14

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
pub const MAX_STAT_KEYS: usize = 8;

pub const CONFIG_SEED: &[u8] = b"config";
pub const COMMUNITY_SEED: &[u8] = b"community";
pub const MEMBER_SEED: &[u8] = b"member";
pub const MARKET_SEED: &[u8] = b"market";
pub const STAKE_SEED: &[u8] = b"stake";
pub const VAULT_SEED: &[u8] = b"vault";

pub const EMERGENCY_REFUND_DELAY: i64 = 3 * 24 * 60 * 60; // 3 days, seconds

pub const MAX_NAME_LEN: usize = 64;
pub const MAX_DESC_LEN: usize = 280;
pub const MAX_URI_LEN: usize = 200;

#[program]
pub mod preder {
    use super::*;

    // ---- Config / admin -------------------------------------------------
    pub fn initialize_config(ctx: Context<InitializeConfig>, keeper: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.keeper = keeper;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    /// Rotate the keeper wallet. ONLY the admin. (spec §1.1 update_keeper)
    pub fn update_keeper(ctx: Context<UpdateKeeper>, new_keeper: Pubkey) -> Result<()> {
        // Auth is enforced by the `has_one = admin` constraint on the context.
        ctx.accounts.config.keeper = new_keeper;
        Ok(())
    }

    // ---- Community ------------------------------------------------------
    pub fn create_community(
        ctx: Context<CreateCommunity>,
        community_id: u64,
        name: String,
        description: String,
        metadata_uri: String,
    ) -> Result<()> {
        require!(name.len() <= MAX_NAME_LEN, PrederError::StringTooLong);
        require!(description.len() <= MAX_DESC_LEN, PrederError::StringTooLong);
        require!(metadata_uri.len() <= MAX_URI_LEN, PrederError::StringTooLong);

        let now = Clock::get()?.unix_timestamp;
        let community = &mut ctx.accounts.community;
        community.creator = ctx.accounts.creator.key();
        community.community_id = community_id;
        community.member_count = 1; // creator is auto first member
        community.market_count = 0;
        community.is_active = true;
        community.created_at = now;
        community.bump = ctx.bumps.community;
        community.name = name;
        community.description = description;
        community.metadata_uri = metadata_uri;

        // Creator's membership record (real on-chain membership).
        let m = &mut ctx.accounts.membership;
        m.community = community.key();
        m.member = ctx.accounts.creator.key();
        m.joined_at = now;
        m.bump = ctx.bumps.membership;
        Ok(())
    }

    pub fn join_community(ctx: Context<JoinCommunity>) -> Result<()> {
        require!(ctx.accounts.community.is_active, PrederError::CommunityInactive);
        let now = Clock::get()?.unix_timestamp;
        let m = &mut ctx.accounts.membership;
        m.community = ctx.accounts.community.key();
        m.member = ctx.accounts.user.key();
        m.joined_at = now;
        m.bump = ctx.bumps.membership;

        let community = &mut ctx.accounts.community;
        community.member_count = community
            .member_count
            .checked_add(1)
            .ok_or(PrederError::MathOverflow)?;
        Ok(())
    }

    pub fn leave_community(ctx: Context<LeaveCommunity>) -> Result<()> {
        // Membership account is closed (rent to member) via the context constraint.
        let community = &mut ctx.accounts.community;
        community.member_count = community.member_count.saturating_sub(1);
        Ok(())
    }

    // ---- Market ---------------------------------------------------------
    #[allow(clippy::too_many_arguments)]
    pub fn create_market(
        ctx: Context<CreateMarket>,
        fixture_id: u64,
        yes_legs: Vec<StatPredicateLeg>,
        no_legs: Vec<StatPredicateLeg>,
        staking_deadline: i64,
        expected_settle_after: i64,
        min_stake: u64,
    ) -> Result<()> {
        require!(
            !yes_legs.is_empty() && yes_legs.len() <= MAX_STAT_KEYS,
            PrederError::InvalidLegCount
        );
        require!(
            !no_legs.is_empty() && no_legs.len() <= MAX_STAT_KEYS,
            PrederError::InvalidLegCount
        );
        require!(
            expected_settle_after >= staking_deadline,
            PrederError::InvalidSettleWindow
        );

        let community = &mut ctx.accounts.community;
        require!(community.is_active, PrederError::CommunityInactive);

        let market = &mut ctx.accounts.market;
        market.community = community.key();
        market.creator = ctx.accounts.creator.key();
        market.fixture_id = fixture_id;
        market.market_nonce = community.market_count;
        market.usdc_mint = ctx.accounts.usdc_mint.key();
        market.vault = ctx.accounts.vault.key();

        // Store predicate legs into fixed arrays bounded by an explicit count.
        // Unused slots stay canonical-zero and are NEVER encoded (iteration stops at count).
        // (spec §1 / §34 item 1 — leg_count design.)
        market.yes_legs = [StatPredicateLeg::default(); MAX_STAT_KEYS];
        for (i, leg) in yes_legs.iter().enumerate() {
            market.yes_legs[i] = *leg;
        }
        market.yes_leg_count = yes_legs.len() as u8;

        market.no_legs = [StatPredicateLeg::default(); MAX_STAT_KEYS];
        for (i, leg) in no_legs.iter().enumerate() {
            market.no_legs[i] = *leg;
        }
        market.no_leg_count = no_legs.len() as u8;

        market.staking_deadline = staking_deadline;
        market.expected_settle_after = expected_settle_after;
        market.min_stake = min_stake;
        market.state = MarketState::Open;
        market.total_yes = 0;
        market.total_no = 0;
        market.winning_outcome = None;
        market.settle_seq = 0;
        market.settle_timestamp = 0;
        market.settle_proof_hash = [0u8; 32];
        market.settled_at = 0;
        market.bump = ctx.bumps.market;

        community.market_count = community
            .market_count
            .checked_add(1)
            .ok_or(PrederError::MathOverflow)?;
        Ok(())
    }

    // ---- Stake ----------------------------------------------------------
    pub fn stake(ctx: Context<StakeCtx>, outcome: bool, amount: u64) -> Result<()> {
        let market = &mut ctx.accounts.market;
        require!(market.state == MarketState::Open, PrederError::MarketNotOpen);

        let now = Clock::get()?.unix_timestamp;
        require!(now < market.staking_deadline, PrederError::StakingClosed);
        require!(amount >= market.min_stake, PrederError::StakeTooSmall);

        // Move USDC from the user into the market escrow vault.
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_account.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        if outcome {
            market.total_yes = market
                .total_yes
                .checked_add(amount)
                .ok_or(PrederError::MathOverflow)?;
        } else {
            market.total_no = market
                .total_no
                .checked_add(amount)
                .ok_or(PrederError::MathOverflow)?;
        }

        let stake = &mut ctx.accounts.stake;
        stake.market = market.key();
        stake.user = ctx.accounts.user.key();
        stake.outcome = outcome;
        stake.amount = amount;
        stake.claimed = false;
        stake.bump = ctx.bumps.stake;

        emit!(StakePlaced {
            market: market.key(),
            user: ctx.accounts.user.key(),
            outcome,
            amount,
        });
        Ok(())
    }

    // ---- Settle (keeper-attested) --------------------------------------
    // Guard order is EXACT per spec §1.2. All checks happen BEFORE state is written.
    pub fn settle(ctx: Context<SettleCtx>, claimed_outcome: bool, proof: SettleProof) -> Result<()> {
        let market = &mut ctx.accounts.market;

        // Guard 0 — idempotency (FIRST). Blocks keeper double-submit / re-settle.
        require!(market.state == MarketState::Open, PrederError::MarketNotOpen);
        // Guard 1 — auth: signer is the configured keeper (via has_one on ctx + this check).
        require!(
            ctx.accounts.keeper.key() == ctx.accounts.config.keeper,
            PrederError::NotKeeper
        );
        // Guard 2 — fixture match.
        require!(proof.fixture_id == market.fixture_id, PrederError::FixtureMismatch);
        // Guard 3 — freshness: attested proof timestamp is at/after expected settle time.
        require!(
            proof.timestamp >= market.expected_settle_after,
            PrederError::ProofTooEarly
        );
        // Guards 4-5 (on-chain CPI + return-data check) DROPPED — keeper-attested model.

        // Record attestation for the Verifiable Resolution panel.
        market.settle_seq = proof.seq;
        market.settle_timestamp = proof.timestamp;
        market.settle_proof_hash = proof.proof_hash;
        market.settled_at = Clock::get()?.unix_timestamp;

        // Guard 6 — zero-winner branch, in the SAME instruction that writes final state.
        let winning_total = if claimed_outcome {
            market.total_yes
        } else {
            market.total_no
        };
        if winning_total == 0 {
            market.state = MarketState::Refundable;
            market.winning_outcome = None;
        } else {
            market.state = MarketState::Settled;
            market.winning_outcome = Some(claimed_outcome);
        }

        emit!(MarketSettled {
            market: market.key(),
            fixture_id: market.fixture_id,
            winning_outcome: market.winning_outcome,
            state: market.state,
            seq: proof.seq,
            timestamp: proof.timestamp,
            proof_hash: proof.proof_hash,
            keeper: ctx.accounts.keeper.key(),
        });
        Ok(())
    }

    // ---- Claim ----------------------------------------------------------
    pub fn claim(ctx: Context<ClaimCtx>) -> Result<()> {
        let market = &ctx.accounts.market;
        require!(market.state == MarketState::Settled, PrederError::MarketNotSettled);

        let winning = market.winning_outcome.ok_or(PrederError::MarketNotSettled)?;
        let stake = &mut ctx.accounts.stake;
        require!(!stake.claimed, PrederError::AlreadyClaimed);
        require!(stake.outcome == winning, PrederError::NotWinningStake);

        let total_pool = market
            .total_yes
            .checked_add(market.total_no)
            .ok_or(PrederError::MathOverflow)?;
        let winning_total = if winning { market.total_yes } else { market.total_no };
        require!(winning_total > 0, PrederError::NoWinningStake); // guaranteed by settle(); defensive.

        // u128 intermediate — u64*u64 overflows at realistic pool sizes (spec §1.1 / §6.2).
        let payout = ((stake.amount as u128)
            .checked_mul(total_pool as u128)
            .ok_or(PrederError::MathOverflow)?
            / (winning_total as u128)) as u64;

        // Checks-effects: mark claimed BEFORE the transfer CPI.
        stake.claimed = true;

        transfer_from_vault(
            &ctx.accounts.token_program,
            &ctx.accounts.vault,
            &ctx.accounts.user_token_account,
            market,
            payout,
        )?;

        emit!(Claimed {
            market: market.key(),
            user: ctx.accounts.user.key(),
            amount: payout,
        });
        Ok(())
    }

    // ---- Emergency refund ----------------------------------------------
    // Flip state to Refundable on the FIRST call, BEFORE any transfer (spec §1.1 / §6.3).
    pub fn emergency_refund(ctx: Context<EmergencyRefundCtx>) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let market = &mut ctx.accounts.market;

        if market.state == MarketState::Open {
            let deadline = market
                .expected_settle_after
                .checked_add(EMERGENCY_REFUND_DELAY)
                .ok_or(PrederError::MathOverflow)?;
            require!(now > deadline, PrederError::RefundNotAvailable);
            market.state = MarketState::Refundable; // terminal flip, closes settle() via guard 0
        }
        require!(
            market.state == MarketState::Refundable,
            PrederError::RefundNotAvailable
        );

        let stake = &mut ctx.accounts.stake;
        require!(!stake.claimed, PrederError::AlreadyClaimed);
        require!(stake.amount > 0, PrederError::NoWinningStake);

        // Checks-effects: mark before transfer. Each staker gets back 100% of their own amount.
        stake.claimed = true;
        let amount = stake.amount;

        transfer_from_vault(
            &ctx.accounts.token_program,
            &ctx.accounts.vault,
            &ctx.accounts.user_token_account,
            market,
            amount,
        )?;

        emit!(Refunded {
            market: market.key(),
            user: ctx.accounts.user.key(),
            amount,
        });
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// Shared vault-out transfer (authority = Market PDA)
// ---------------------------------------------------------------------------
fn transfer_from_vault<'info>(
    token_program: &Program<'info, Token>,
    vault: &Account<'info, TokenAccount>,
    dest: &Account<'info, TokenAccount>,
    market: &Account<'info, Market>,
    amount: u64,
) -> Result<()> {
    let community = market.community;
    let fixture_bytes = market.fixture_id.to_le_bytes();
    let nonce_bytes = market.market_nonce.to_le_bytes();
    let bump = market.bump;
    let seeds: &[&[u8]] = &[
        MARKET_SEED,
        community.as_ref(),
        fixture_bytes.as_ref(),
        nonce_bytes.as_ref(),
        std::slice::from_ref(&bump),
    ];
    let signer: &[&[&[u8]]] = &[seeds];

    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: vault.to_account_info(),
                to: dest.to_account_info(),
                authority: market.to_account_info(),
            },
            signer,
        ),
        amount,
    )
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
#[account]
#[derive(InitSpace)]
pub struct Config {
    pub admin: Pubkey,
    pub keeper: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Community {
    pub creator: Pubkey,
    pub community_id: u64,
    pub member_count: u64,
    pub market_count: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
    #[max_len(MAX_NAME_LEN)]
    pub name: String,
    #[max_len(MAX_DESC_LEN)]
    pub description: String,
    #[max_len(MAX_URI_LEN)]
    pub metadata_uri: String,
}

#[account]
#[derive(InitSpace)]
pub struct Membership {
    pub community: Pubkey,
    pub member: Pubkey,
    pub joined_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub community: Pubkey,
    pub creator: Pubkey,
    pub fixture_id: u64,
    pub market_nonce: u64,
    pub usdc_mint: Pubkey,
    pub vault: Pubkey,
    pub yes_legs: [StatPredicateLeg; MAX_STAT_KEYS],
    pub yes_leg_count: u8,
    pub no_legs: [StatPredicateLeg; MAX_STAT_KEYS],
    pub no_leg_count: u8,
    pub staking_deadline: i64,
    pub expected_settle_after: i64,
    pub min_stake: u64,
    pub state: MarketState,
    pub total_yes: u64,
    pub total_no: u64,
    pub winning_outcome: Option<bool>,
    // Settlement attestation (keeper-attested) — surfaced in the Verifiable Resolution panel.
    pub settle_seq: u64,
    pub settle_timestamp: i64,
    pub settle_proof_hash: [u8; 32],
    pub settled_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Stake {
    pub market: Pubkey,
    pub user: Pubkey,
    pub outcome: bool,
    pub amount: u64,
    pub claimed: bool,
    pub bump: u8,
}

// Preder's own predicate-leg storage struct (rebuilt into TxLINE's Vec<StatPredicate>
// off-chain at settle-time; bounded by leg_count, so padding never leaks).
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Default, InitSpace)]
pub struct StatPredicateLeg {
    pub kind: u8,       // 0 = Single, 1 = Binary
    pub index_a: u8,
    pub index_b: u8,    // Binary only
    pub op: u8,         // 0 = Add, 1 = Subtract (Binary only)
    pub threshold: i32,
    pub comparison: u8, // 0 = GreaterThan, 1 = LessThan, 2 = EqualTo
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum MarketState {
    Open,
    Settled,
    Refundable,
}

// Keeper-attested proof metadata (validated off-chain via TxLINE `.view()` on validate_stat_v3).
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SettleProof {
    pub fixture_id: u64,
    pub timestamp: i64,
    pub seq: u64,
    pub proof_hash: [u8; 32],
}

// ---------------------------------------------------------------------------
// Events (indexed off-chain for leaderboard + Verifiable Resolution panel)
// ---------------------------------------------------------------------------
#[event]
pub struct StakePlaced {
    pub market: Pubkey,
    pub user: Pubkey,
    pub outcome: bool,
    pub amount: u64,
}

#[event]
pub struct MarketSettled {
    pub market: Pubkey,
    pub fixture_id: u64,
    pub winning_outcome: Option<bool>,
    pub state: MarketState,
    pub seq: u64,
    pub timestamp: i64,
    pub proof_hash: [u8; 32],
    pub keeper: Pubkey,
}

#[event]
pub struct Claimed {
    pub market: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
}

#[event]
pub struct Refunded {
    pub market: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
}

// ---------------------------------------------------------------------------
// Contexts
// ---------------------------------------------------------------------------
#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = 8 + Config::INIT_SPACE,
        seeds = [CONFIG_SEED],
        bump
    )]
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateKeeper<'info> {
    pub admin: Signer<'info>,
    #[account(mut, seeds = [CONFIG_SEED], bump = config.bump, has_one = admin @ PrederError::NotAdmin)]
    pub config: Account<'info, Config>,
}

#[derive(Accounts)]
#[instruction(community_id: u64)]
pub struct CreateCommunity<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        space = 8 + Community::INIT_SPACE,
        seeds = [COMMUNITY_SEED, creator.key().as_ref(), &community_id.to_le_bytes()],
        bump
    )]
    pub community: Account<'info, Community>,
    #[account(
        init,
        payer = creator,
        space = 8 + Membership::INIT_SPACE,
        seeds = [MEMBER_SEED, community.key().as_ref(), creator.key().as_ref()],
        bump
    )]
    pub membership: Account<'info, Membership>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinCommunity<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub community: Account<'info, Community>,
    #[account(
        init,
        payer = user,
        space = 8 + Membership::INIT_SPACE,
        seeds = [MEMBER_SEED, community.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub membership: Account<'info, Membership>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LeaveCommunity<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub community: Account<'info, Community>,
    #[account(
        mut,
        close = user,
        seeds = [MEMBER_SEED, community.key().as_ref(), user.key().as_ref()],
        bump = membership.bump,
        constraint = membership.community == community.key() @ PrederError::NotMember,
    )]
    pub membership: Account<'info, Membership>,
}

#[derive(Accounts)]
#[instruction(fixture_id: u64)]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        mut,
        seeds = [COMMUNITY_SEED, community.creator.as_ref(), &community.community_id.to_le_bytes()],
        bump = community.bump,
        has_one = creator @ PrederError::NotCommunityCreator,
    )]
    pub community: Account<'info, Community>,
    #[account(
        init,
        payer = creator,
        space = 8 + Market::INIT_SPACE,
        seeds = [MARKET_SEED, community.key().as_ref(), &fixture_id.to_le_bytes(), &community.market_count.to_le_bytes()],
        bump
    )]
    pub market: Account<'info, Market>,
    pub usdc_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = creator,
        seeds = [VAULT_SEED, market.key().as_ref()],
        bump,
        token::mint = usdc_mint,
        token::authority = market,
    )]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct StakeCtx<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    /// Proves the user is a member of the market's community.
    #[account(
        seeds = [MEMBER_SEED, market.community.as_ref(), user.key().as_ref()],
        bump = membership.bump,
        constraint = membership.community == market.community @ PrederError::NotMember,
    )]
    pub membership: Account<'info, Membership>,
    #[account(
        init,
        payer = user,
        space = 8 + Stake::INIT_SPACE,
        seeds = [STAKE_SEED, market.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub stake: Account<'info, Stake>,
    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == market.usdc_mint,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [VAULT_SEED, market.key().as_ref()],
        bump,
        constraint = vault.key() == market.vault,
    )]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettleCtx<'info> {
    pub keeper: Signer<'info>,
    #[account(seeds = [CONFIG_SEED], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub market: Account<'info, Market>,
}

#[derive(Accounts)]
pub struct ClaimCtx<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(
        mut,
        seeds = [STAKE_SEED, market.key().as_ref(), user.key().as_ref()],
        bump = stake.bump,
        has_one = user @ PrederError::NotWinningStake,
        constraint = stake.market == market.key() @ PrederError::NotWinningStake,
    )]
    pub stake: Account<'info, Stake>,
    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == market.usdc_mint,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [VAULT_SEED, market.key().as_ref()],
        bump,
        constraint = vault.key() == market.vault,
    )]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct EmergencyRefundCtx<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(
        mut,
        seeds = [STAKE_SEED, market.key().as_ref(), user.key().as_ref()],
        bump = stake.bump,
        has_one = user @ PrederError::NotMember,
        constraint = stake.market == market.key() @ PrederError::NotMember,
    )]
    pub stake: Account<'info, Stake>,
    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == market.usdc_mint,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [VAULT_SEED, market.key().as_ref()],
        bump,
        constraint = vault.key() == market.vault,
    )]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------
#[error_code]
pub enum PrederError {
    #[msg("Market is not open")]
    MarketNotOpen,
    #[msg("Market is not settled")]
    MarketNotSettled,
    #[msg("Market is not refundable")]
    MarketNotRefundable,
    #[msg("Caller is not the keeper")]
    NotKeeper,
    #[msg("Caller is not the admin")]
    NotAdmin,
    #[msg("Caller is not the community creator")]
    NotCommunityCreator,
    #[msg("Staking deadline has passed")]
    StakingClosed,
    #[msg("Stake amount below minimum")]
    StakeTooSmall,
    #[msg("Proof fixture does not match market fixture")]
    FixtureMismatch,
    #[msg("Proof is not fresh enough (before expected settle time)")]
    ProofTooEarly,
    #[msg("Invalid leg count")]
    InvalidLegCount,
    #[msg("Invalid settle window")]
    InvalidSettleWindow,
    #[msg("Stake outcome is not the winning outcome")]
    NotWinningStake,
    #[msg("Already claimed / refunded")]
    AlreadyClaimed,
    #[msg("Emergency refund not yet available")]
    RefundNotAvailable,
    #[msg("Arithmetic overflow")]
    MathOverflow,
    #[msg("Community is not active")]
    CommunityInactive,
    #[msg("Not a community member")]
    NotMember,
    #[msg("String field too long")]
    StringTooLong,
    #[msg("No stake on the winning side")]
    NoWinningStake,
}
