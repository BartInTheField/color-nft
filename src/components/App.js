import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import './App.css';
import Color from "../abis/Color.json";


export const App = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [totalSupply, setTotalSupply] = useState(0);
    const [colors, setColors] = useState([]);

    const [input, setInput] = useState('');

    useEffect(() => {
        (async () => {
            await loadWeb3();
            await loadBlockChainData();
        })();
    }, [])

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }

    const loadBlockChainData = async () => {
        const web3 = window.web3;

        // Load account
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        //Load colors
        const networkId = await web3.eth.net.getId();
        const networkData = Color.networks[networkId];

        if(networkData) {
            const abi = Color.abi;
            const address = networkData.address;

            const contract = new web3.eth.Contract(abi, address);
            setContract(contract)

            const totalSupply = await contract.methods.totalSupply().call()
            setTotalSupply(totalSupply);

            let colors = []
            for (let i = 0; i < totalSupply; i++) {
                colors.push(await contract.methods.colors(i).call());
            }
            setColors(colors);
        } else {
            window.alert('The smart contract is not deployed to this network!')
        }
    }

    const mint = (color) => {
        contract.methods.mint(color).send({from: account})
            .once('receipt', (receipt) => {
                setColors([...colors, color])
            })
    }

    return (
        <div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="http://www.dappuniversity.com/bootcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Color Tokens
                </a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <small className="text-white">
                            <span id="account">
                                {account}
                            </span>
                        </small>
                    </li>
                </ul>
            </nav>
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <h1>Issue token</h1>
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                mint(input);
                            }}>
                                <input type="text"
                                    className="form-control mb-1"
                                       placeholder="e.g. #FFFFFF"
                                       value={input}
                                       onChange={(input) => setInput(input.target.value)}
                                />
                                <input type="submit" className="btn btn-block btn-primary" value="MINT"/>
                            </form>
                        </div>
                    </main>
                </div>

                <hr/>
                <div className="row text-center">
                    {colors.map((color, index) => {
                        return(
                            <div key={index} className="col-md-3 mb-3">
                                <div className="token" style={{backgroundColor: color}}> </div>
                                <div>{color}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
