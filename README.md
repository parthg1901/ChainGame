# Chaingame

This repo is based on [gskril/ens-offchain-registrar](https://github.com/gskril/ens-offchain-registrar).

## [Gateway](worker/README.md)

[Cloudflare Worker](https://developers.cloudflare.com/workers/) is used as the [CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) gateway. [Cloudflare D1](https://developers.cloudflare.com/d1/) is used to store name data.

These choices allow for a scalable namespace with low cost (store up to 1M names for free), low latency, and high availability.

## [Frontend](web/README.md)

A Next.js app that uses Thorin to allow users to easily buy NFTs and Developers to register their contracts and generate Dynamic NFTs easily using CCIP Read

## [Contract](smart-contracts/README.md)

A hardhat-based environment that contains 3 main contracts to use Chainlink CCIP, Automation and Functions easily.