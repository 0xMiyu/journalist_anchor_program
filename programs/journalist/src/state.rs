use anchor_lang::{prelude::*, solana_program};
use solana_program::program_pack::IsInitialized;
#[account]
pub struct ArticleAccountState {
    pub is_initialized: bool,
    pub author: String,
    pub mint_address: String,
    pub timestamp: u64,
}
impl IsInitialized for ArticleAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}