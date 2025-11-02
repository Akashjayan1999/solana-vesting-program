#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

#[program]
pub mod vesting {
    use super::*;

    pub fn create_vesting_account(ctx: Context<CreateVestingAccount>, amount: u64) -> Result<()> {
        let vesting_account = &mut ctx.accounts.vesting_account;
        vesting_account.amount = amount;
        vesting_account.start_time = ctx.accounts.clock.unix_timestamp;
        vesting_account.end_time = vesting_account.start_time + vesting_account.duration;
        Ok(())
    }
   
}

#[derive(Accounts)]
pub struct CreateVestingAccount<'info> {
#[account(mut)]
pub signer : Signer<'info>,

#[account(init, 
    payer = signer,
    space = 8 + INIT_)]
}

