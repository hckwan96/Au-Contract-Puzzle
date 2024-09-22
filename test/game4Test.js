const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const add =  ethers.provider.getSigner(0).getAddress();

    return { game, add };
  }

  it('should be a winner', async function () {
    const { game, add } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}
    await game.write(add);

    await game.win(add);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });

  it('should be a winner with two signers', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    const signerX = ethers.provider.getSigner(0)
    const signerY = ethers.provider.getSigner(1)

    // nested mappings are rough :}
    game.connect(signerY).write(await signerX.getAddress())
    game.connect(signerX).write(await signerY.getAddress())

    await game.connect(signerX).win(await signerY.getAddress())

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
