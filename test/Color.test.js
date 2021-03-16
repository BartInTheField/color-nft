const Color = artifacts.require('./Color.sol');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('Color', (accounts) => {

    let contract;
    before(async () => {
        contract = await Color.deployed();
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address =  contract.address;

            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })

        it('has a name', async () => {
            const name = await contract.name();
            assert.equal(name, 'Color');
        })


        it('has a symbol', async () => {
            const name = await contract.symbol();
            assert.equal(name, 'COLOR');
        })
    })


    describe('minting', async () => {
      it('creates a new token', async () => {
          // SUCCESS
          const result = await contract.mint('#FFFFFF');
          const totalSupply = await contract.totalSupply();

          assert.equal(totalSupply, 1);

          const {tokenId, from, to} = result.logs[0].args;
          assert.equal(tokenId.toNumber(), 1, 'id is correct');
          assert.equal(from, '0x0000000000000000000000000000000000000000', 'from is correct');
          assert.equal(to, accounts[0], 'to is correct');

          // FAILURE: cannot mint same color twice
         await contract.mint('#FFFFFF').should.be.rejected;
      })
    })


    describe('indexing', async () => {
        it('lists colors', async () => {
            // Mint 3 more tokens
            await contract.mint('#000FFF');
            await contract.mint('#000000');
            await contract.mint('#FFF000');

            const totalSupply = await contract.totalSupply();

            let color;
            let result = [];

            for (let i = 0; i < totalSupply; i++) {
                color = await contract.colors(i);
                result.push(color);
            }

            let expected = ['#FFFFFF', '#000FFF', '#000000', '#FFF000'];
            assert.equal(result.join(','), expected.join(','))
        })
    })
})
