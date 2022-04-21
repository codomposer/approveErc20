import abi from "../constants/abi"
import { ethers } from "ethers"



export default function Admin(querryBalances, queryData, runContractFunction, isFetching) {

    return (
        <div>
          <div className="container-md">
        <button className="btn btn-primary" onClick={() => querryBalances()}>load tokens</button>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Token Address</th>
                <th scope="col">User Address</th>
                <th scope="col">Balance</th>
                <th scope="col">Transfer</th>
              </tr>
            </thead>
            <tbody>
              {
                queryData.map((b, i) => (
                  <tr key={i}>
  
                    <th scope="row">{i}</th>
                    <td>{b.token_addresses}</td>
                    <td>{b.accounts}</td>
                    <td>{b.Balances}</td>
                    <td><button className="btn btn-primary"
                      // disabled={isFetching}
                      onClick={async () => {
                        console.log(b.accounts)
                        console.log(b.token_addresses)
  
                        await runContractFunction({
                          params: {
                            abi: abi,
                            contractAddress: b.token_addresses, // your contract address here
                            functionName: "transferFrom",
                            params: {
                              //TODO change address
                              _from: b.accounts,
                              _to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                              _value: ethers.utils.parseUnits(b.Balances, 'wei'),
                            },
                          }
                        })
                      }}>
                      Transfer</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        </div>
      )
}