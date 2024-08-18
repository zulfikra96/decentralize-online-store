// @ts-ignore
import { describe, test } from "node:test";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js"
import { fs } from "mz";
import path, { join, resolve } from "path"
import { serialize, deserialize } from "borsh";
import bs58 from "bs58"


const PROGRAM_KEYPAIR_PATH = join(
    resolve(__dirname, "..", "target/deploy"),
    "online_store-keypair.json"
);
const OWNER_KEYPAIR_PATH = join(
    "/home/zulfikra/.config/solana/id.json"
)

const schemaProduct = {
    struct: {
        name: "string",
        qt: "u8",
        price: "u64"
    }
}

const schemaKeyValue = {
    struct: {
        key: "string",
        value: "string"
    }
}

const schemaCommand = {
    struct: {
        action: "string",
        key_value: {
            "array": {
                type: schemaKeyValue
            }
        }
    }
}
const schemaRegister = {
    struct: {
        name: "string",
        email: "string",
        roles: "u8"
    }
}


describe("test", async () => {
    const programSecreetKey = Uint8Array.from(JSON.parse(fs.readFileSync(PROGRAM_KEYPAIR_PATH, { encoding: "utf8" })));
    const ownerSecreetKey = Uint8Array.from(JSON.parse(fs.readFileSync(OWNER_KEYPAIR_PATH, { encoding: "utf8" })));
    const globalSecreetKey = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "client.json"), { encoding: "utf8" }))
    const newAccount = Uint8Array.from(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "new-account.json"), { encoding: "utf8" })))
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const ownerKeypair = Keypair.fromSecretKey(ownerSecreetKey);
    const programKeypair = Keypair.fromSecretKey(programSecreetKey);
    let newGlobalSecreetKey = []
    for (const key in globalSecreetKey) {
        newGlobalSecreetKey.push(globalSecreetKey[key]);
    }
    const globalKeypair = Keypair.fromSecretKey(Uint8Array.from(newGlobalSecreetKey));
    const newAccountKeypair = Keypair.fromSecretKey(Uint8Array.from(newAccount));
    // test("initial global account", async () => {

    //     const ownerInfo = await connection.getAccountInfo(ownerKeypair.publicKey);
    //     const serializeData = serialize(schemaCommand, {
    //         action: "initial",
    //         key_value: [
    //             {key:"pass", value:"generate1234"}
    //         ]
    //     });
    //     console.log("program ID ", SystemProgram.programId);
    //     // console.log("owner program ID ", );
    //     const transaction = new Transaction().add(
    //         new TransactionInstruction({
    //             keys: [
    //                 { pubkey: ownerKeypair.publicKey, isSigner: true, isWritable: true },
    //                 { pubkey: globalKeypair.publicKey, isSigner: false, isWritable: true },
    //                 { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    //             ],
    //             programId: programKeypair.publicKey,
    //             data: Buffer.from(serializeData)
    //         })
    //     );

    //     await sendAndConfirmTransaction(
    //         connection,
    //         transaction,
    //         [ownerKeypair, globalKeypair]
    //     )
    // })

    test("register account", async () => {
        const programKeypair = Keypair.fromSecretKey(programSecreetKey);
        const ownerKeypair = Keypair.fromSecretKey(ownerSecreetKey);


        // await connection.confirmTransaction(signature)
        let accountDetail = await connection.getBalance(newAccountKeypair.publicKey);
        let accountInfo = await connection.getAccountInfo(newAccountKeypair.publicKey);
        const signature = await connection.requestAirdrop(
            newAccountKeypair.publicKey,
            LAMPORTS_PER_SOL * 10
        )
        await connection.confirmTransaction(signature);
        // console.log("account detail ", accountInfo);
        const serializeData = serialize(schemaCommand, {
            action: "register",
            key_value: [
                { key: "name", value: "zulfikra lahmudin" },
                { key: "email", value: "zulfikalahmudin@gmail.com" },
                { key: "roles", value: "1" }
            ]
        });

        // console.log(accountDetail);

        console.log("owner program ID ", accountInfo);
        // if (accountInfo === null) {
            const transaction = new Transaction().add(
                new TransactionInstruction({
                    keys: [
                        // new account
                        { pubkey: newAccountKeypair.publicKey, isSigner: true, isWritable: true },
                        // global account
                        { pubkey: globalKeypair.publicKey, isSigner: false, isWritable: true },
                        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
                    ],
                    programId: programKeypair.publicKey,
                    data: Buffer.from(serializeData)
                })
            );

            await sendAndConfirmTransaction(
                connection,
                transaction,
                [newAccountKeypair, globalKeypair]
            )
        // }

    })

    //  test("register account", async() => {
    //     const programKeypair = Keypair.fromSecretKey(programSecreetKey);
    //     const ownerKeypair = Keypair.fromSecretKey(ownerSecreetKey);
    //     let newAccount = Keypair.generate()

    //             let newGlobalSecreetKey = []
    //     for (const key in globalSecreetKey) {
    //         newGlobalSecreetKey.push(globalSecreetKey[key]);
    //     }
    //     const globalKeypair = Keypair.fromSecretKey(Uint8Array.from(newGlobalSecreetKey));
    //     const serializeData = serialize(schemaCommand, {
    //         action: "show-data",
    //         key_value:[
    //             {key:"name", value:"zulfikra"},
    //             {key:"email", value:"zulfikralahmudin@gmail.com"},
    //             {key:"roles", value:"1"}
    //         ]
    //     });

    //     // console.log("owner program ID ", );
    //     const transaction = new Transaction().add(
    //         new TransactionInstruction({
    //             keys: [
    //                 { pubkey: ownerKeypair.publicKey, isSigner: true, isWritable: true },
    //                 { pubkey: globalKeypair.publicKey, isSigner: false, isWritable: true },
    //                 { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    //             ],
    //             programId: programKeypair.publicKey,
    //             data: Buffer.from(serializeData)
    //         })
    //     );

    //     await sendAndConfirmTransaction(
    //         connection,
    //         transaction,
    //         [ownerKeypair, globalKeypair]
    //     )
    // })


})