# 🛠️ Supersim on Scaffold-ETH 2 🏗

🧪 An open-source, work-in-progress, toolkit for building decentralized applications (dapps) on the Optimism Superchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

## Requirements

Before you begin, you need to install the following tools:

- [Supersim](https://github.com/ethereum-optimism/supersim)
- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Supersim on Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd my-dapp-example
yarn install
```

2. Run supersim in the first terminal:

```
yarn chain
```

This command starts a local Optimism Superchain network using Foundry. The networks run on your local machine and can be used for testing and development. You can customize the network configuration in `packages/foundry/foundry.toml`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local layer 1 network. The contract is located in `packages/foundry/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/foundry/script` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn foundry:test`

- Edit your smart contracts in `packages/foundry/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/foundry/script`

## Documentation

Visit the Scaffold-ETH 2 [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

Visit the Optimism Supersim [docs](https://github.com/ethereum-optimism/supersim) to learn more about Supersim.

To know more about Scaffold-ETH 2 features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
