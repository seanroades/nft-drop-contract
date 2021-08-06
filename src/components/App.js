import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import FantasyIslands from '../abis/FantasyIslands.json'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      saleActive: false,
      ownerPresent: false,
      islandContract: null,
      totalSupply: 0
    }
    this.loadBlockchainData = this.loadBlockchainData.bind(this)
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider_)
    }
    else {
      window.alert('Non-Ethereum browser detected. You need to install Metamask to continue.')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // load user's account 
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    if (this.state.account === "0xd1b76793Eb5dCE67Bd422129a257443ddb62307B") {
      this.setState({ownerPresent: true})
    }
    const networkId = await web3.eth.net.getId()
    const networkData = FantasyIslands.networks[networkId]
    if (networkData) {
      const abi = FantasyIslands.abi
      const address = networkData.address
      var islandContract = new web3.eth.Contract(abi, address)
      console.log(islandContract)
      var saleActiveETH = await islandContract.methods.saleActive.call()
      var totalSupply = await islandContract.methods.totalSupply().call()
      console.log("total supply", totalSupply.toString())
      console.log("saleActiveETH", saleActiveETH)
      this.setState({saleActive: saleActiveETH, totalSupply: totalSupply.toString()})
      this.setState({islandContract})
    }
    else {
      alert('Smart contract is not deployed on this network. Please switch the ETH Mainnet.')
    }
  }

  turnSaleOn = async () => {
    var saleActiveETH = await this.state.islandContract.methods.saleActive.call()
    this.setState({saleActive: saleActiveETH})
    console.log("beginning sale active", this.state.saleActive)
    this.state.islandContract.methods.changeSaleStatus(!this.state.saleActive).send({ 
      from: this.state.account
    }).then((txHash) => console.log("TTTTT", txHash))
  }

  mint = () => {
    console.log("mint")
    this.state.islandContract.methods.mintCertificate.send({ 
      from: this.state.account,
      value: 3140000000000000000
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
      console.log("DONE")
    })
  }

  render() {
    return (
      <div className="MainBG">
        <div className="FINav">
          <div className="TextContainer">
            <h1 className="FIName TextMediumMod InlineMod BoldMod">Republic Realm</h1>
            <p className="UserAcc InlineMod SmallTextMod BoldMod">Account: {(this.state.account).substring(0,7)}...</p>
          </div>
        </div>
        <div>
          <p className="MainHeading">Fantasy Island Sale</p>
          { this.state.saleActive ?
            <>
              <div className="ButtonContainer">
                <button className="FIButton" onClick={this.mint}>Mint a certificate</button>
              </div>
              <p className="FISmallTitles">{this.state.totalSupply}/100 certificates minted</p>
            </>
            :
            <>
              <p className="FISmallTitles">
                The sale is not currently active! Come back later!
              </p>
            </>
          }
        </div>
        { this.state.ownerPresent &&
          <div>
            <p className="FISmallTitles">Testing info (Not visible to non-authorized accounts):</p>
            <p className="FISmallTitles">Sale active? {(this.state.saleActive).toString()}</p>
            <p className="FISmallTitles">Owner Present? {(this.state.ownerPresent).toString()}</p>
            <div className="ButtonContainer">
              <button className="FIButton" onClick={this.turnSaleOn}>{this.state.saleActive ? "turn off sale" : "turn on sale"}</button>
            </div>
          </div>
        }
      </div>

    );
  }
}

export default App;
