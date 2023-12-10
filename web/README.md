## Chaingame Website

Once you've got the [Cloudflare Worker](/worker/README.md) running, run `yarn dev` to start the website locally and test it out.

[ccipRead.ts](/web/src/utils/ccipRead.ts) is responsible for carrying out the CCIP Read transactions. It is the modified version of the example given on EIP3668 docs.

The UI is built using Thorin to allow efficient designing.

The website contains two pages - 
- `/` - The index page allows the user to choose from various game contracts and allows them to buy from various NFTs listed on Chaingame
- `/contract` - This page is for the Dev Mode. It allows developers to register their contract and generate/list their NFTs on chaingame.