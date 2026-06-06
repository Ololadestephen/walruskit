# WalrusKit

Programmable recovery infrastructure for encrypted Walrus blobs on Sui.

**Live demo:** https://walruskit.vercel.app/

WalrusKit is a 19-package developer toolkit that helps apps encrypt sensitive data locally, store the ciphertext on Walrus, anchor recovery policy on Sui, read state through Tatum's Sui RPC, and expose the flow through SDKs, UI primitives, CLI tools, and an MCP server for AI agents.

It is built for apps that need private data storage with a real recovery path: notes, files, credentials, agent memory, team secrets, game assets, and any payload that should be recoverable only when clear on-chain conditions pass.

## Why WalrusKit

Walrus gives builders decentralized blob storage, but production apps still need the surrounding recovery system:

- local encryption before anything leaves the app
- encrypted blob upload and download through Walrus
- Sui policy state for owner, beneficiary, guardians, heartbeat, and final delay
- Tatum-powered Sui reads for objects, transactions, and package state
- verification that downloaded Walrus bytes match trusted on-chain metadata
- reusable SDK, CLI, React/headless helpers, wallet helpers, templates, docs, and MCP tools

WalrusKit packages those pieces into a reusable recovery layer.

## Technical Architecture

```text
plaintext in app
  -> encrypted locally
  -> ciphertext stored on Walrus
  -> blob ID, hash, and size anchored in a Sui capsule
  -> Move policy enforces heartbeat, beneficiary request, guardian approvals, and final delay
  -> Tatum Sui RPC reads capsule/package state
  -> verifier checks Walrus bytes before recovery/decryption
```

Walrus stores the encrypted data. Sui decides when recovery is allowed. Tatum provides the RPC path used by the toolkit and proof scripts.

### Layer Responsibilities

| Layer | Responsibility | Package |
| --- | --- | --- |
| Local encryption | Encrypt text/files before data leaves the user's machine. Plaintext is never uploaded to Walrus. | `@walruskit/crypto` |
| Walrus storage | Upload/download encrypted bytes through publisher and aggregator endpoints. | `@walruskit/walrus` |
| Sui policy | Anchor owner, beneficiary, guardians, heartbeat timeout, final delay, blob ID, hash, and byte size. | `@walruskit/move`, `@walruskit/sui` |
| Tatum RPC | Read package objects, capsule state, transaction data, and recovery status through Tatum's Sui gateway. | `@walruskit/tatum` |
| Verification | Confirm downloaded Walrus bytes match trusted hash and size metadata before recovery/decryption. | `@walruskit/verifier` |
| App/agent surface | Provide SDK calls, CLI proofs, React/headless helpers, templates, and MCP tools. | `@walruskit/sdk`, `@walruskit/cli`, `@walruskit/mcp` |

### Recovery State Machine

```text
owner active
  -> heartbeat keeps recovery locked
  -> heartbeat timeout passes
beneficiary requests recovery
  -> guardians approve until threshold is met
  -> final delay gives owner a cancellation window
recovery ready
  -> app/agent can verify Walrus blob metadata and release decryptable access
```

This separation keeps the payload private while making the recovery policy independently verifiable. Walrus never receives plaintext, Sui never stores the secret, and Tatum RPC gives the toolkit a repeatable way to inspect the live policy state.

## Live Testnet Proof

These IDs are live proof anchors for the current testnet deployment and demo flows.

| Item | Value |
| --- | --- |
| Sui package | `0xfeaae2b29cf99a0bf5ad3bbac5bb3588c8d5245d1d236de2b0b5419eee0c08e1` |
| Move module | `capsule` |
| Package publish tx | `2RiS77KLzMEkPwuQbbBtWLHb2VpKWgr3EjPdCY8QhuqX` |
| Live capsule object | `0xe99b68fccb3d3d008347cff9f640f977aeaa122818bfc966ec962e58432bf74a` |
| Live Walrus blob | `1cwtvAyFuiplx-9Gpxwfj68blKSDZzEoolSzA0FKmWc` |
| Full demo capsule | `0x19a94707ecc5ccee9186af782a1c934a73a32a8e9add1b80238bd209d66c483a` |

### Verification Targets

Judges can verify the integration from the terminal:

```bash
npm run build
npm run proof:walrus-tatum
npm run move:build
npm run move:test
npm run proof:sui
npm run capsule:demo-recovery
```

Those commands cover the full technical path: TypeScript packages, local encryption, Walrus upload/download, Tatum Sui RPC reads, Move policy validation, live capsule inspection, wallet-ready call planning, and the recovery lifecycle.

## Package Surface

| Package | Purpose |
| --- | --- |
| `@walruskit/core` | Shared types, errors, policy evaluation |
| `@walruskit/crypto` | WebCrypto encryption/decryption helpers |
| `@walruskit/walrus` | Walrus publisher and aggregator adapter |
| `@walruskit/tatum` | Tatum Sui JSON-RPC provider |
| `@walruskit/sui` | Sui capsule read/write plans |
| `@walruskit/sdk` | High-level recovery capsule API |
| `@walruskit/react` | React-facing controller helpers |
| `@walruskit/ui` | UI copy, tokens, and component specs |
| `@walruskit/headless` | Framework-agnostic recovery state models |
| `@walruskit/policies` | Policy presets |
| `@walruskit/move` | Sui Move policy module |
| `@walruskit/verifier` | Walrus blob hash/size verification |
| `@walruskit/wallet-sui` | Wallet transaction descriptors and signing bridge |
| `@walruskit/docs` | Guide metadata and docs content |
| `@walruskit/agent` | Policy-aware helpers for AI agents |
| `@walruskit/cli` | CLI commands for plans and status |
| `@walruskit/mcp` | MCP server manifest for AI agents/devtools |
| `@walruskit/next` | Next.js env and route helpers |
| `create-walruskit` | Template/scaffolder metadata |

## Recovery Policy

Each Sui Capsule supports:

- owner heartbeat / proof of life
- beneficiary recovery request
- guardian threshold approvals
- final delay before recovery is ready
- owner cancellation
- Walrus blob ID/hash/size anchoring

The Move module rejects recovery while the owner is still inside the heartbeat window. Once the timeout passes, the beneficiary can request recovery, guardians can approve, and the final delay must pass before the capsule is recoverable.

## Quick Start

Install dependencies:

```bash
npm install
```

Build all TypeScript packages:

```bash
npm run build
```

Validate the Move module:

```bash
npm run move:build
npm run move:test
```

Run the demo/docs site:

```bash
npm run demo:dev
```

Useful routes:

- `/` - landing page
- `/docs` - docs introduction
- `/docs/quickstart` - proof setup
- `/docs/components` - UI/component surface
- `/docs/walrus-storage` - Walrus integration
- `/docs/sui-policy` - Move recovery policy
- `/docs/tatum-rpc` - Tatum RPC usage
- `/docs/examples/recovery-flow` - full lifecycle walkthrough

## Environment

Create `.env` in the repo root:

```bash
TATUM_API_KEY=
TATUM_SUI_RPC_URL=https://sui-testnet.gateway.tatum.io
WALRUSKIT_PACKAGE_ID=0xfeaae2b29cf99a0bf5ad3bbac5bb3588c8d5245d1d236de2b0b5419eee0c08e1
WALRUSKIT_CAPSULE_ID=0xe99b68fccb3d3d008347cff9f640f977aeaa122818bfc966ec962e58432bf74a
```

Optional Walrus overrides:

```bash
WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
```

For live capsule creation/recovery scripts, also configure the Sui signing environment used by your local wallet/script setup.

## Proof Commands

### Walrus + Tatum Proof

```bash
npm run proof:walrus-tatum
```

Proves:

- Tatum Sui RPC works with the API key
- local encryption works
- encrypted ciphertext uploads to Walrus
- ciphertext downloads from Walrus
- `@walruskit/verifier` confirms hash and size
- downloaded ciphertext decrypts back to the original note

Expected proof shape:

```text
Tatum Sui RPC read succeeded
Verification: Walrus blob verified against the Sui capsule metadata.
Proof complete
```

### Sui Package + Capsule Proof

```bash
npm run proof:sui
```

Proves:

- Tatum reads Sui chain data
- Tatum reads the published package object
- Tatum reads the live shared Capsule object
- WalrusKit parses policy, guardians, approvals, heartbeat, and Walrus metadata
- wallet-ready Move call plans are generated

Expected proof shape:

```text
Published package/object read through Tatum
Live capsule read through Tatum
Recovery ready: no
Current blocker: Recovery has not been requested.
Proof complete
```

### Full Recovery Lifecycle Proof

```bash
npm run capsule:demo-recovery
```

Creates a fresh short-window demo capsule and runs the lifecycle:

1. encrypt a note
2. upload ciphertext to Walrus
3. create a Sui Capsule
4. prove early recovery is rejected because the owner is still active
5. wait for heartbeat timeout
6. request recovery
7. approve as guardian
8. prove final delay blocks recovery
9. wait final delay
10. read final status through Tatum

Expected proof shape:

```text
Early recovery request rejected: owner is still active
Recovery requested tx: 13cuyvxX31zmDLyA9aDz17XhpN3LKCkc39tg9DQwy9x7
Guardian approved tx: ERYMin8JbUeT1kkfCHpd2vsMZ5NrhsYbGHPSmcjMwE1a

Status before final delay
Recovery ready: no
Blocker: Final delay has not passed.

Final status
Approvals: 1 of 1
Owner inactive: yes
Final delay passed: yes
Recovery ready: yes
```

## CLI

Print wallet-ready Move call plans:

```bash
node packages/cli/bin/walruskit.js capsule:create-plan
```

Read live capsule status through Tatum:

```bash
node packages/cli/bin/walruskit.js capsule:status
```

Print the MCP manifest:

```bash
node packages/mcp/bin/walruskit-mcp.js
```

## MCP + Agents

`@walruskit/mcp` exposes:

- `walruskit_encrypt_and_store`
- `walruskit_recovery_status`
- `walruskit_create_move_call`

This lets AI agents inspect encrypted Walrus recovery capsules and prepare wallet-signable actions without receiving plaintext secrets or private keys.

`@walruskit/agent` provides helper APIs for:

- checking recovery readiness
- summarizing blockers
- preparing beneficiary, guardian, and owner actions
- integrating recovery state into agent workflows

## SDK Example

```ts
import { createWalrusKit } from "@walruskit/sdk";

const rk = createWalrusKit({
  walrus: {
    publisherUrl: "https://publisher.walrus-testnet.walrus.space",
    aggregatorUrl: "https://aggregator.walrus-testnet.walrus.space",
  },
  tatum: {
    rpcUrl: "https://sui-testnet.gateway.tatum.io",
    apiKey: process.env.TATUM_API_KEY,
  },
  move: {
    packageId: process.env.WALRUSKIT_PACKAGE_ID!,
  },
});

const encrypted = await rk.encryptText("recovery note");
const blob = await rk.uploadEncryptedBlob(encrypted);

const plan = rk.createCapsulePlan({
  owner: "0x...",
  beneficiary: "0x...",
  guardians: ["0x...", "0x...", "0x..."],
  threshold: 2,
  heartbeatTimeoutMs: 30 * 24 * 60 * 60 * 1000,
  finalDelayMs: 24 * 60 * 60 * 1000,
  blob,
});
```

## Demo App

The demo app lives in `apps/demo` and is built with Next.js. It includes:

- a polished landing page
- multi-page documentation
- component documentation
- quickstart proof commands
- architecture, Walrus, Sui policy, Tatum RPC, SDK, verifier, MCP, and recovery-flow pages

Run it with:

```bash
npm run demo:dev
```

## Repo Structure

```text
apps/demo                 Next.js landing/docs site
examples/node             Node usage example
packages/core             shared types and policy logic
packages/crypto           encryption helpers
packages/walrus           Walrus storage adapter
packages/tatum            Tatum Sui RPC client
packages/sui              Sui call planning and parsing
packages/sdk              high-level SDK
packages/move             Sui Move capsule module
packages/verifier         blob integrity checks
packages/cli              CLI helpers
packages/mcp              MCP server
packages/agent            agent helpers
templates                 starter templates
scripts                   proof and lifecycle scripts
```

## Current Status

- Package architecture: complete
- Encryption, Walrus adapter, Tatum RPC adapter: complete
- Move capsule policy: complete and published on Sui testnet
- Verifier: complete
- CLI proof scripts: complete
- MCP manifest/tools: complete
- Next.js landing/docs site: complete
- Full recovery lifecycle proof: complete

The automated lifecycle proof uses a single funded testnet wallet as owner, beneficiary, and guardian so the backend flow can run in one command. The policy and SDK support separate addresses for real applications.
