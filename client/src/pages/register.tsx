
// import { Adapter } from "@solana/wallet-adapter-base"
import { useWallet, useConnection, ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useMemo, useState } from "react"
import "@solana/wallet-adapter-react-ui/styles.css"
import connection from "../config/connection";
import { serialize } from "borsh";

const PROGRAM_ID = new PublicKey("2rDzTj4enxuRuWSb1Lzyyx2dyoMYThi9awSyMHvJWyWQ");
const GLOBAL_ID = new PublicKey("Gw9EaGn5gQJw9WQ4LqLk6LpQqXxRq6Xy8XK4Rk5Zj4L");
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

const Home = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
    })
    const { publicKey } = useWallet();
    useEffect(() => {
       (async () => {
        if (publicKey) {
            const accountInfo = await connection.getAccountInfo(publicKey) ;
            const data = Buffer.from(accountInfo?.data);
            console.log(data)
            // alert("change wallet")
        }
       })()
    }, [publicKey])


    const register = async (e) => {
        e.preventDefault();
        const serializeData = serialize(schemaCommand, {
            action: "register",
            key_value: [
                { key: "name", value: "zulfikra lahmudin" },
                { key: "email", value: "zulfikalahmudin@gmail.com" },
                { key: "roles", value: "1" }
            ]
        });
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
    }
    return (
        <div className="flex flex-row justify-center ">
            <form onSubmit={register} className="flex flex-col p-4 shadow w-6/12">
                <h1>Register</h1>
                <br />
                <div className="flex flex-col mb-2">
                    <label htmlFor="">Name</label>
                    <input onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" className="input input-bordered" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="">Email</label>
                    <input onChange={(e) => setForm({ ...form, email: e.target.value })} type="text" className="input input-bordered" />
                </div>
                <button className="btn">register</button>
            </form>
        </div>
    );
}

export default function Register() {
    const network = clusterApiUrl('devnet'); // You can also use 'mainnet-beta', 'testnet'

    const wallets = useMemo(
        () => [
            // new PhantomWalletAdapter(), // Add more wallets here if needed
        ],
        []
    );
    useEffect(() => {
     
    },[])
    const { connection } = useConnection()
    const { publicKey, connected } = useWallet()

    const connectToWallet = useCallback(() => {
        if (!publicKey) {
            alert("wallet not connected")
            return
        }
    }, [])

    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Home />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}