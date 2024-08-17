import { } from "@walletconnect/web3wallet"
import { Link } from "react-router-dom"

export default function Index() {
    return (
        <div className="w-full flex flex-row justify-center ">
            <div className="flex flex-col justify-center w-4/12 h-screen">
                <div className="flex flex-col  shadow-md p-4 ">
                    <span className="mb-2">Register</span>
                    <button className="btn mb-4">Connect to wallet</button>
                    
                    <Link className="" to={"/register"}>Create new account</Link>
                </div>
            </div>
        </div>
    )
}