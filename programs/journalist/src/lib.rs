use anchor_lang::prelude::*;
pub mod error;
pub mod state;
pub mod processor;
use processor::*;

declare_id!("CV1DphaGKtzK1mMskXjDhSGQAnaXEqtq2dqFYSnXMrJm");

#[program]
pub mod journalist {
    use super::*;

    pub fn upload(
        ctx: Context<UploadArticle>,
        author: String,
        mint_address: String,
        timestamp: u64
    ) -> Result<()> {
        upload_article(ctx, author, mint_address, timestamp)
    }

    // pub fn get_articles(ctx: Context<Initialize>) -> Result<()> {
    //     Ok(())
    // }
    
}

