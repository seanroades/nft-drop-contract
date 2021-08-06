const { assert } = require('chai')

const FantasyIslands = artifacts.require('./FantasyIslands.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('FantasyIslands', (accounts) => {
  let contract

  before(async () => {
    contract = await FantasyIslands.deployed()
  })

  describe('deployment', async() => {
    it('deploys successfully', async () => {
      const address = contract.address
      console.log(address)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
      assert.notEqual(address, 0x0)
    })

    it('has a name', async () => {
      const name = await contract.name
      assert(name, "Republic Realm's Fantasy Islands")
      console.log(name)
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol
      assert(symbol, "RRFI")
      console.log(symbol)
    })
  })

  describe('minting', async () => {
    it('creates a new token', async () => {
      const result = await contract.mintCertificate()
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from')
      assert.equal(event.to, accounts[0])
      console.log(event.tokenId.toNumber())
    })
  })

  describe('indexing', async() => {
    it('lists islands', async () => {
      // Mint 3 islands
      await contract.mintCertificate()
      await contract.mintCertificate()
      await contract.mintCertificate()
      const totalSupply = await contract.totalSupply()
      
      let cert
      let result = []
      for (var i = 0; i < totalSupply; i++) {
        cert = await contract.certificates(i)
        console.log("TEST", cert)
        result.push(cert)
      }
      let expected = [1, 2, 3, 4]
      assert.equal(result.join(','), expected.join(','))
    })
  })

  describe('activateSale', async () => {
    it('activates sale', async () => {
      await contract.changeSaleStatus(true)
      // console.log("sale", contract.saleActive)
      // assert.equal(contract.saleActive, true, 'sale is active')
    })
  })
})