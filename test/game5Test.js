const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { BigNumber } = require('ethers')

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    const threshold = BigNumber.from(
      '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf',
    )

    let signAdd =  await ethers.provider.getSigner(0).getAddress();
    let i = 0;
    // good luck

    let wallet;
    while (true) {
      wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      if (ethers.BigNumber.from(wallet.address).lt(threshold))
        break;

      i++;
    }

    console.log(`Wallet address: ${wallet.address} after ${i} tries`);
     // Fund the wallet
     await ethers.provider.getSigner(0).sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("1.0")
    });

    // Call the win function
    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
