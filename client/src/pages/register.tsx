import { useCallback } from "react"
import { Keypair, Connection } from '@solana/web3.js'
import Swal from "sweetalert2";
// import { Adapter } from "@solana/wallet-adapter-base"
export default function Register() {
    
    const createAccount = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if(window?.solana) {
            // console.log(window.solana)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const provider = window.solana;
            try {
                const endpoint = import.meta.env.VITE_URL_CONNECTION;
                const response = await provider.connect();
                const walletAddress = response.publicKey
                const connection = new Connection(endpoint, "confirmed")
                const clientInfo = await connection.getAccountInfo(walletAddress);
                if(clientInfo === null) {
                    const swal = await Swal.fire({
                        icon:"info",
                        title:"Your account is not created yet",
                        confirmButtonText:"Create",
                        showDenyButton:true,
                        denyButtonText:"Cancel",
                        toast: true
                    });
                   
                }
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
                    <button onClick={createAccount} className="btn ">Create Account</button>
                </div>
            </div>
        </div>
    )
}