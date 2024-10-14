// @ts-ignore
import { describe, test } from "node:test";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"
import { fs } from "mz";
import path, { join, resolve } from "path"
import { serialize, deserialize } from "borsh";
import bs58 from "bs58"
// import { randomUUID } from "crypto";
import { v4 } from "uuid"


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
    const globalSecreetKey = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "new-account.json"), { encoding: "utf8" }))
    const newAccount = Uint8Array.from(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "new-account.json"), { encoding: "utf8" })))
    // const network = clusterApiUrl("http://localhost:8899");
    const connection = new Connection("http://localhost:8899", "confirmed");
    const ownerKeypair = Keypair.fromSecretKey(ownerSecreetKey);
    const programKeypair = Keypair.fromSecretKey(programSecreetKey);
    let newGlobalSecreetKey = [];
    for (const key in globalSecreetKey) {
        newGlobalSecreetKey.push(globalSecreetKey[key]);
    }
    const globalKeypair = Keypair.fromSecretKey(Uint8Array.from(newGlobalSecreetKey));
    const newAccountKeypair = Keypair.fromSecretKey(Uint8Array.from(newAccount));
    console.log("secreet key ", bs58.encode(ownerKeypair.secretKey));
    // test("initial global account", async () => {

    //     const ownerInfo = await connection.getAccountInfo(globalKeypair.publicKey);
    //     const serializeData = serialize(schemaCommand, {
    //         action: "initial",
    //         key_value: [
    //             { key: "pass", value: "generate1234" }
    //         ]
    //     });
    //     let seed = Buffer.from("global");
    //     const [pda, bum] = await PublicKey.findProgramAddressSync([seed], programKeypair.publicKey);
    //     console.log("PDA: ", pda.toBase58())
    //     console.log("BUM: ", bum)
    //     const pdaInfo = await connection.getAccountInfo(pda);
    //     console.log("account info ", pdaInfo)
    //         // return console.log("owner ", ownerInfo)

    //     const transaction = new Transaction().add(
    //         new TransactionInstruction({
    //             keys: [
    //                 { pubkey: ownerKeypair.publicKey, isSigner: true, isWritable: true },
    //                 { pubkey: pda, isSigner: false, isWritable: true },
    //                 { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    //             ],
    //             programId: programKeypair.publicKey,
    //             data: Buffer.from(serializeData)
    //         })
    //     );

    //     await sendAndConfirmTransaction(
    //         connection,
    //         transaction,
    //         [ownerKeypair]
    //     )
    //     // console.log("owner program ID ", );
    // })

    test("get products", async () => {
        let seed = Buffer.from("global");
        const [pda, bum] = await PublicKey.findProgramAddressSync([seed], programKeypair.publicKey);

        const globalAccount = await connection.getAccountInfo(pda);
        const productInterface = {
            struct: {
                id: 'string',
                name: 'string',
                qt: 'f64',
                price: 'f64'
            }
        }

        const products = {
            struct: {
                products: {
                    'array': { type: productInterface }
                }
            }
        };

        // const userInterface = {
        //     struct: {
        //         pub_key: 'string',
        //         name: 'string',
        //         email: 'string',
        //         roles: 'u8',
        //         image_url: 'string',
        //         products: {
        //             'array':{
        //                 type: productInterface
        //             }
        //         }
        //     }
        // }

        // const accounts = {
        //     struct: {
        //         accounts: {
        //             'array': { type: userInterface }
        //         }
        //     }
        // };


        const des = deserialize(products, globalAccount.data);
        console.log(des)
    })

    // test("Add product", async () => {
    //     let seed = Buffer.from("global");

    //     const productInterface = {
    //         struct: {
    //             id: 'string',
    //             name: 'string',
    //             qt: 'u64',
    //             price: 'f64'
    //         }
    //     }

    //     const products = {
    //         struct: {
    //             products: {
    //                 'array': { type: productInterface }
    //             }
    //         }
    //     };

    //     const serializeData = serialize(schemaCommand, {
    //         action: "add-product",
    //         key_value: [
    //             {key:'id', value: v4().toString()},
    //             { key: "name", value: "kayu" },
    //             { key: "qt", value: "10" },
    //             { key: "price", value: "10.0" }
    //         ]
    //     });
    //     const programKeypair = Keypair.fromSecretKey(programSecreetKey);
    //     const ownerKeypair = Keypair.fromSecretKey(ownerSecreetKey);
    //     const [pda, bum] = await PublicKey.findProgramAddressSync([seed], programKeypair.publicKey);
    //     const globalAccount = await connection.getAccountInfo(pda);
    //     const ownerAccount = await connection.getAccountInfo(ownerKeypair.publicKey);

    //     console.log("PDA: ", pda.toBase58())
    //     console.log("BUM: ", bum)
    //     console.log("global account : ", ownerAccount)
    //     // const pdaInfo = await connection.getAccountInfo(pda);
    //     // const des = deserialize(products, globalAccount.data);
    //     const transaction = new Transaction().add(
    //         new TransactionInstruction({
    //             keys: [
    //                 // new account
    //                 { pubkey: ownerKeypair.publicKey, isSigner: true, isWritable: true },
    //                 // global account
    //                 { pubkey: pda, isSigner: false, isWritable: true },
    //                 { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    //             ],
    //             programId: programKeypair.publicKey,
    //             data: Buffer.from(serializeData)
    //         })
    //     );

    //     await sendAndConfirmTransaction(
    //         connection,
    //         transaction,
    //         [ownerKeypair]
    //     )
    // })

    // test("register account", async () => {
    //     const programKeypair = Keypair.fromSecretKey(programSecreetKey);
    //     // const ownerKeypair = Keypair.fromSecretKey(ownerSecreetKey);

    //     // let keygen = Keypair.generate();
    //     // console.log("keygen ", keygen);
    //     // await connection.confirmTransaction(signature)
    //     let accountDetail = await connection.getBalance(newAccountKeypair.publicKey);
    //     let accountInfo = await connection.getAccountInfo(newAccountKeypair.publicKey);
    //     const signature = await connection.requestAirdrop(
    //         newAccountKeypair.publicKey,
    //         LAMPORTS_PER_SOL
    //     )
    //     let seed = Buffer.from("global");
    //     const [pda, bum] = await PublicKey.findProgramAddressSync([seed], programKeypair.publicKey);
    //     await connection.confirmTransaction(signature);

    //     // console.log("account detail ", accountInfo);
    //     const serializeData = serialize(schemaCommand, {
    //         action: "register",
    //         key_value: [
    //             { key: "name", value: "zulfikra lahmudin" },
    //             { key: "email", value: "zulfikalahmudin@gmail.com" },
    //             { key: "roles", value: "1" }
    //         ]
    //     });

    //     // console.log(accountDetail);

    //     console.log("owner program ID ", accountInfo);
    //     // if (accountInfo === null) {
    //     const transaction = new Transaction().add(
    //         new TransactionInstruction({
    //             keys: [
    //                 // new account
    //                 { pubkey: newAccountKeypair.publicKey, isSigner: true, isWritable: true },
    //                 // global account
    //                 { pubkey: pda, isSigner: false, isWritable: true },
    //                 { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    //             ],
    //             programId: programKeypair.publicKey,
    //             data: Buffer.from(serializeData)
    //         })
    //     );

    //     await sendAndConfirmTransaction(
    //         connection,
    //         transaction,
    //         [newAccountKeypair, globalKeypair]
    //     )
    //     // }

    // })

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