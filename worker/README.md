# Chaingame CCIP Read Gateway

[Cloudflare Worker](https://developers.cloudflare.com/workers/) is used as the [CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) gateway. [Cloudflare D1](https://developers.cloudflare.com/d1/) is used to store name data.

These choices allow for a scalable namespace with low cost (store up to 1M names for free), low latency, and high availability.

## API Routes
- `/contracts` - GET - Returns all contracts from the database
- `/get/{owner}` - GET - Returns the contract for a given owner address
- `/lookup/{sender}/{data}.json` - GET - CCIP Read lookup
- `/set` - POST - Adds a contract to the database
- `/get-tokens` - POST - Returns all the tokens for a specific contract

## Run Locally

1. Navigate to this directory: `cd worker`
2. Login to Cloudflare: `npx wrangler login`
3. Create a D1 instance: `npx wrangler d1 create <DATABASE_NAME>` and update the `[[d1_databases]]` section of `wrangler.toml` with the returned info
4. Create the default table in the local database: `yarn run dev:create-tables`
5. Set your environment variables: `cp .dev.vars.example .dev.vars` (this is the private key for one of the addresses listed as a signer on your resolver contract)
6. Install dependencies: `yarn install`
7. Start the dev server: `yarn dev`

## Deploy to Cloudflare

1. Navigate to this directory: `cd worker`
2. Login to Cloudflare: `npx wrangler login`
3. Deploy the Worker: `yarn deploy`
4. Create the default table in the prod database: `yarn run prod:create-tables`
5. Set your environment variable: `echo <PRIVATE_KEY> | npx wrangler secret put PRIVATE_KEY` (this is the private key for one of the addresses listed as a signer on your resolver contract)
