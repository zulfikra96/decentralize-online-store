
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {  join, resolve} from "path";
import { fs } from "mz";
import dotenv from "dotenv"

dotenv.config()
const PROGRAM_KEYPAIR_PATH = join(
    resolve(__dirname, "target/deploy"),
    "online_store-keypair.json"
)

const OWNER_KEYPAIR_PATH = join(
    "/home/zulfikra/.config/solana/id.json"
)


async function initialGlobalAccount() {
    const programSecreetKey = Uint8Array.from(JSON.parse(fs.readFileSync(PROGRAM_KEYPAIR_PATH, { encoding: "utf8" })));
    const accountSecreetKey = Uint8Array.from(JSON.parse(await fs.readFile(OWNER_KEYPAIR_PATH, { encoding: "utf8" })));
    const programKeypair = Keypair.fromSecretKey(programSecreetKey);

    const accountKeypair = Keypair.fromSecretKey(accountSecreetKey);
    const programId = programKeypair.publicKey;
    // console.log("program ID ", programId.toString())

    const newClient = accountKeypair;
    // const generateClient = Keypair.generate();
    let globalSecreetKey = JSON.parse(fs.readFileSync("client.json", { encoding: "utf8" }))
    let newGlobalSecreetKey = []
    for (const key in globalSecreetKey) {
        newGlobalSecreetKey.push(globalSecreetKey[key]);
    }
    const globalKeypair = Keypair.fromSecretKey(Uint8Array.from(newGlobalSecreetKey));
    // return console.log(globalKeypair);
    // console.log("new client ",newClient.publicKey)
    // console.log("client ", process.env.ONCHAIN_BASEURL);
    const connection = new Connection(process.env.ONCHAIN_BASEURL,"confirmed");
    // const clientPubKey = await PublicKey.createWithSeed(
    //     newClient.publicKey,
    //     "client",
    //     programId
    // )
    const signature = await connection.requestAirdrop(
        newClient.publicKey,
        LAMPORTS_PER_SOL * 2
    );
    
    const tx = new Transaction();
    const clientInfo = await connection.getAccountInfo(globalKeypair.publicKey);
    // console.log("key of new Client", programId)
    // console.log("key of global Client", globalKeypair.publicKey)
    await connection.confirmTransaction(signature);
    // console.log("address public key ", clientPubKey, " ", globalKeypair.publicKey);
    // if(clientInfo === null) {
    //     const ownerTransaction = await SystemProgram.createAccount({
    //         fromPubkey: newClient.publicKey,
    //         lamports: await connection.getMinimumBalanceForRentExemption(8),
    //         space: 8,
    //         programId,
    //         newAccountPubkey:   globalKeypair.publicKey,
    //     })
    
    //     tx.add(ownerTransaction);
    
    //     await sendAndConfirmTransaction(
    //         connection,
    //         tx,
    //         [newClient]
    //     );
    // }
    // const transaction = new TransactionInstruction({
    //     keys: [
    //         {pubkey: newClient.publicKey, isSigner: true, isWritable: true},
    //         {pubkey: globalKeypair.publicKey, isSigner: false, isWritable: true},
    //         {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
    //     ],
    //     programId,
    //     data: Buffer.from([0])
    // })
    // await sendAndConfirmTransaction(
    //     connection,
    //     tx.add(transaction),
    //     [newClient, globalKeypair]
    // );

    // if(clientInfo === null) {
        
    //     const transaction = SystemProgram.createAccountWithSeed({
    //         fromPubkey: newClient.publicKey,
    //         lamports: await connection.getMinimumBalanceForRentExemption(8),
    //         space: 8,
    //         programId,
    //         newAccountPubkey: clientPubKey,
    //         basePubkey: newClient.publicKey,
    //         seed: "client"
    //     })
    //     tx.add(transaction);
    //     await sendAndConfirmTransaction(
    //         connection,
    //         tx,
    //         [newClient]
    //     )        
    //     console.log("call here")
    // }else {
       
    // }
    
}


(() => {
    initialGlobalAccount();
})()