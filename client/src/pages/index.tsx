import { } from "@walletconnect/web3wallet"
import { useCallback } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

export default function Index() {

    const connecttoWallet = useCallback(async () => {
        if(window?.solana) {
            const provider = window.solana;
            const response = await provider.connect();
            const walletAddress = response.publicKey;
            console.log("wallet address ", walletAddress);
        }else {
            Swal.fire({
                toast:true,
                icon:"error",
                title:"Solana is not installed yet"
            })
        }
    },[])

    return (
        <div className="w-full flex flex-row justify-center ">
            <div className="flex flex-col justify-center w-4/12 h-screen">
                <div className="flex flex-col  shadow-md p-4 ">
                    <span className="mb-2">Login</span>
                    <button onClick={connecttoWallet} className="btn mb-4">Connect to wallet</button>
                    
                    <Link className="" to={"/register"}>Create new account</Link>
                </div>
            </div>
        </div>
    )
}