
// import { Adapter } from "@solana/wallet-adapter-base"
import { useWallet, useConnection, ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js";
import { useCallback, useEffect, useMemo } from "react"
import "@solana/wallet-adapter-react-ui/styles.css"
import { redirect, useNavigate } from "react-router";
const Home = () => {
    const navigate = useNavigate()

    const { publicKey } = useWallet();
    useEffect(() => {
        if (publicKey) {
            // return navigate("/register")
        }

        
    },[publicKey])
    return (
        <div className="flex flex-row justify-center ">
            <div className="flex flex-col p-4 shadow w-6/12">
                <h1>Connect to Solana Wallet</h1>
                {/* Button to connect/disconnect wallet */}
                <WalletMultiButton />
                {/* Display the connected wallet's public key */}
                {publicKey ? (
                    <p>Connected Wallet: {publicKey.toBase58()}</p>
                ) : (
                    <p>No wallet connected</p>
                )}
            </div>
        </div>
    );
}

export default function ConnectToWallet() {
    const network = clusterApiUrl('devnet'); // You can also use 'mainnet-beta', 'testnet'
    const wallets = useMemo(
        () => [
            // new PhantomWalletAdapter(), // Add more wallets here if needed
        ],
        []
    );
    const { connection } = useConnection()
    const { publicKey, connected } = useWallet()

    const connectToWallet = useCallback(() => {
        if (!publicKey) {
            return alert("wallet is not connected")
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