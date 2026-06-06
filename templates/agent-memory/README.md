# Agent Memory Template

This template shows how an AI agent can use WalrusKit as encrypted long-term memory.

The agent stores encrypted memories in Walrus, anchors blob IDs and recovery policy on Sui, and exposes recovery status through the WalrusKit MCP server. The agent never needs plaintext access unless the recovery rule says the beneficiary can decrypt.

## MCP Tooling

```bash
npx walruskit-mcp
```

Tools exposed:

- `walruskit_encrypt_and_store`
- `walruskit_recovery_status`
- `walruskit_create_move_call`
