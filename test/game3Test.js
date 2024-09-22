const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const signer1 = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);
    const signer3 = ethers.provider.getSigner(2);

    let signer = [];
    for (let i = 0; i < 3; i++)
      signer.push(ethers.provider.getSigner(i));

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example
    const address1 = await signer1.getAddress();

    return { game, signer1, signer2, signer3, signer };
  }

  it('should be a winner with each signer', async function () {
    const { game, signer1, signer2, signer3  } = await loadFixture(deployContractAndSetVariables);

    // you'll need to update the `balances` mapping to win this stage

    // to call a contract as a signer you can use contract.connect
    await game.connect(signer1).buy({ value: '2' });
    await game.connect(signer2).buy({ value: '3' });
    await game.connect(signer3).buy({ value: '1' });

    const address1 = await signer1.getAddress();
    const address2 = await signer2.getAddress();
    const address3 = await signer3.getAddress();

    // TODO: win expects three arguments
    await game.win(address1, address2, address3);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });

  it('should be a winner with signer array', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);

    // you'll need to update the `balances` mapping to win this stage

    // to call a contract as a signer you can use contract.connect
    await game.connect(signer[0]).buy({ value: '2' });
    await game.connect(signer[1]).buy({ value: '3' });
    await game.connect(signer[2]).buy({ value: '1' });

    const add1 = await signer[0].getAddress();
    const add2 = await signer[1].getAddress();
    const add3 = await signer[2].getAddress();

    // TODO: win expects three arguments
    await game.win(add1, add2, add3);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
