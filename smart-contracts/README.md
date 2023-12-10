# Chaingame Contracts

##[Chaingame.sol](/smart-contracts/contracts/Chaingame.sol)
It contains the following functions -
- `createToken` - It checks the `msg.value` and reverts `OffchainLookup`
- `createTokenWithSignature` - Called by CCIP Read after data is updated on the gateway
- `buy` - It checks the `msg.value` and reverts `OffchainLookup`
- `buyWithSignature` - Called by CCIP Read after data is updated on the gateway. It adds the token into `CCIPHandler.sol` if the token type => level. Whereas, it adds the token into `AutomatedFunctions.sol` if the token type => interval

##[CCIPHandler.sol](/smart-contracts/contracts/CCIPHandler.sol)
- `sendMessage` - It allows to send ccip message to the receiver contract helping in minting and token uri updates for the NFTs
- `_ccipReceiver` - This handle Level Updates triggered inside `DestinationMinter.sol` contract

##[AutomatedFunctions.sol](/smart-contracts/contracts/AutomatedFunctions.sol)
- `checkUpkeep` - It checks if an interval-based NFT's metadata needs to be updated
- `performUpkeep` - Triggers metadata changes using chainlink automation and sends a request to the cloudflare worker using Chainlink Functions.
- `sendMessage` - Sends request to the cloudflare worker using Chainlink functions
