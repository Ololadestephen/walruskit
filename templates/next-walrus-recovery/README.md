# Next Walrus Recovery Template

A starter app shape for building a WalrusKit frontend.

## What This Template Should Wire

- wallet connection through the Sui wallet adapter of your choice
- local note/file encryption with `@walruskit/crypto`
- encrypted blob upload through `@walruskit/walrus`
- capsule creation and recovery transaction plans through `@walruskit/sdk`
- Sui reads through Tatum RPC
- recovery status panels through `@walruskit/headless` and `@walruskit/ui`

## Environment

```bash
TATUM_API_KEY=
TATUM_SUI_RPC_URL=https://sui-testnet.gateway.tatum.io
WALRUS_PUBLISHER_URL=
WALRUS_AGGREGATOR_URL=
WALRUSKIT_PACKAGE_ID=
```

Phase 3 is intentionally app-specific and is left for the demo implementation.
