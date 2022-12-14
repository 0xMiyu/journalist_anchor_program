import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Journalist } from "../target/types/journalist";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("journalist", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());
    const provider = anchor.getProvider();
    const program = anchor.workspace.Journalist as Program<Journalist>;
    const fuckme= new Uint8Array([132,172,121,121,84,214,75,133,128,233,161,166,128,83,118,207,226,200,121,55,249,35,184,75,175,16,178,2,91,63,233,180,38,186,184,159,130,13,88,188,3,62,226,193,252,10,24,45,243,96,97,25,84,106,192,124,129,177,78,99,127,106,253,123])
    const user = anchor.web3.Keypair.fromSecretKey(fuckme);
    // anchor.setProvider(anchor.AnchorProvider.env());
    // const provider = anchor.getProvider();
    // const program = anchor.workspace.Journalist as Program<Journalist>;
    // const user = anchor.web3.Keypair.generate();

    let authorAccount: PublicKey;
    let mint_address: string;
    it("Airdrops to user for payer", async () => {
        const airdropSellerSig = await provider.connection.requestAirdrop(
            user.publicKey,
            2e9
        );
        const latestSellerBlockhash =
            await provider.connection.getLatestBlockhash();
        await provider.connection.confirmTransaction({
            blockhash: latestSellerBlockhash.blockhash,
            lastValidBlockHeight: latestSellerBlockhash.lastValidBlockHeight,
            signature: airdropSellerSig,
        });
    });
    it("Uploads Article LFGGGGG!!!", async () => {
        let author = "samuel";
        let mint_address = "GoMp6aZ3U7KxsxVCo3FmZ8gkEaxPhcE9aL82Z695zrss";
        let timestamp: anchor.BN;
        timestamp = new anchor.BN(6553543456969);
        [authorAccount] = await PublicKey.findProgramAddressSync(
            [
                user.publicKey.toBytes(),
                timestamp.toArrayLike(Buffer, 'be', 8),
            ],
            program.programId
        );
            // console.log(timestamp.toArrayLike(Buffer, 'be', 8))
        await program.methods
            .upload(author, mint_address, timestamp)
            .accounts({
                initializer: user.publicKey,
                pdaAccount: authorAccount,
                systemProgram: SystemProgram.programId,
            })
            .signers([user])
            .rpc();
        console.log("or here?")
        const storedArticleAccount =
            await program.account.articleAccountState.fetch(authorAccount);

        console.log(
            "storedArticleAccount author:",
            storedArticleAccount.author
        );
        console.log(
            "storedArticleAccount mint address:",
            storedArticleAccount.mintAddress
        );
        console.log(
            "storedArticleAccount timestamp:",
            storedArticleAccount.timestamp
        );
        assert.equal(storedArticleAccount.author, author);
        assert.equal(storedArticleAccount.mintAddress, mint_address);
        // assert.equal(storedArticleAccount.timestamp, timestamp);
    });
});
