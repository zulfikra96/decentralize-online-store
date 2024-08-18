import { useCallback, useEffect } from "react"
import { Keypair, Connection } from '@solana/web3.js'
import Swal from "sweetalert2";
import  { ConnectionProvider, WalletProvider, useWallet, } from "@solana/wallet-adapter-react"
import  {  } from "@solana/wallet-adapter-phantom";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import { Adapter } from "@solana/wallet-adapter-base"
import "@solana/wallet-adapter-react-ui/styles.css"
export const SolanaConnect = () => {
    return (
        <WalletModalProvider>
            <WalletMultiButton/>
            <WalletDisconnectButton />
        </WalletModalProvider>
    )
}
export default function Register() {
    const { publicKey } = useWallet()

    useEffect(() => {
        console.log(publicKey)
    },[])

    const createAccount = useCallback(async () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if(window?.solana) {
            // console.log(window.solana)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            try {
               
                // if(!publicKey) {
                //     await Swal.fire({
                //         icon:"error",
                //         toast: true,
                //         title:"Wallet is not connected"
                //     })
                // }
                // const endpoint = import.meta.env.VITE_URL_CONNECTION;
                // const clientInfo = await (new Connection(endpoint)).getAccountInfo(publicKey);
                // if(clientInfo === null) {
                //     const swal = await Swal.fire({
                //         icon:"info",
                //         title:"Your account is not created yet",
                //         confirmButtonText:"Create",
                //         showDenyButton:true,
                //         denyButtonText:"Cancel",
                //         toast: true
                //     });
                //     if(swal.isConfirmed) {
                //         // 
                //     }
                // }
            } catch (error) {
                console.log(error)
                alert(error);
            }
        }else {
            alert("there is no wallet active on your browser");
        }
    }, [])

    return (
        <div className="flex flex-row w-full justify-center">
            <div className="flex flex-col justify-center  w-4/12 h-screen">
                <div className="flex flex-col shadow-md p-4 rounded-md ">
                    <span className="mb-2">Register</span>
                    <SolanaConnect/>
                </div>
            </div>
        </div>
    )
}