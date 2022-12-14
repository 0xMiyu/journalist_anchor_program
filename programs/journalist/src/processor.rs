
use crate::error::ArticleError;
use crate::state::ArticleAccountState;
use anchor_lang::{prelude::*, solana_program::program_pack::IsInitialized};
#[derive(Accounts)]
#[instruction(author: String, mint_address: String, timestamp: u64)]
pub struct UploadArticle<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(
    init_if_needed,
    seeds = [initializer.key.as_ref(), timestamp.to_be_bytes().as_ref()],
    bump,
    payer = initializer,
    space = 400,
    constraint = author.len() + mint_address.len() + 8 <= 400 
    @ ArticleError::InvalidDataLength
    )]
    pub pda_account: Account<'info, ArticleAccountState>,
    pub system_program: Program<'info, System>,
}


pub fn upload_article(
    ctx: Context<UploadArticle>,
    author: String,
    mint_address: String,
    timestamp: u64,
) -> Result<()> {
    msg!("Uploading new article...");
    msg!("Author: {}", author);
    msg!("NFT Mint Address: {}", mint_address);
    msg!("Timestamp: {}", timestamp);

    if ctx.accounts.pda_account.is_initialized() {
        msg!("Account already initialized");
        return Err(ProgramError::AccountAlreadyInitialized.into());
    }
    ctx.accounts.pda_account.author = author;
    ctx.accounts.pda_account.mint_address = mint_address;
    ctx.accounts.pda_account.timestamp = timestamp;
    ctx.accounts.pda_account.is_initialized = true;

    msg!("PDA created: {}", ctx.accounts.pda_account.key());
    Ok(())
}