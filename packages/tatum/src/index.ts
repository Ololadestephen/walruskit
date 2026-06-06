export type SuiNetwork = "mainnet" | "testnet" | "devnet";

export type TatumSuiClientConfig = {
  rpcUrl?: string;
  apiKey?: string;
  network?: SuiNetwork;
  fetch?: typeof fetch;
  retries?: number;
  retryDelayMs?: number;
};

export type JsonRpcRequest = {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: unknown[];
};

export type JsonRpcResponse<T> = {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
};

const defaultUrls: Record<SuiNetwork, string> = {
  mainnet: "https://sui-mainnet.gateway.tatum.io",
  testnet: "https://sui-testnet.gateway.tatum.io",
  devnet: "https://sui-devnet.gateway.tatum.io",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class TatumSuiClient {
  private readonly rpcUrl: string;
  private readonly fetchImpl: typeof fetch;
  private requestId = 1;

  constructor(private readonly config: TatumSuiClientConfig) {
    this.rpcUrl = config.rpcUrl ?? defaultUrls[config.network ?? "testnet"];
    this.fetchImpl = config.fetch ?? fetch;
  }

  async request<T>(method: string, params: unknown[] = []): Promise<T> {
    const payload: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: this.requestId++,
      method,
      params,
    };

    const retries = this.config.retries ?? 3;
    const retryDelayMs = this.config.retryDelayMs ?? 750;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const response = await this.fetchImpl(this.rpcUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(this.config.apiKey ? { "x-api-key": this.config.apiKey } : {}),
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => ({}))) as JsonRpcResponse<T>;
      if (response.ok && !body.error) {
        return body.result as T;
      }

      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt === retries) {
        throw new Error(body.error?.message ?? `Tatum Sui RPC failed with ${response.status}`);
      }

      await delay(retryDelayMs * (attempt + 1));
    }

    throw new Error("Tatum Sui RPC failed.");
  }

  getObject(objectId: string, options: Record<string, unknown> = {}) {
    return this.request("sui_getObject", [objectId, options]);
  }

  multiGetObjects(objectIds: string[], options: Record<string, unknown> = {}) {
    return this.request("sui_multiGetObjects", [objectIds, options]);
  }

  getTransactionBlock(digest: string, options: Record<string, unknown> = {}) {
    return this.request("sui_getTransactionBlock", [digest, options]);
  }

  queryEvents(query: Record<string, unknown>, cursor: unknown = null, limit = 50, descending = true) {
    return this.request("suix_queryEvents", [query, cursor, limit, descending]);
  }

  dryRunTransactionBlock(txBytes: string) {
    return this.request("sui_dryRunTransactionBlock", [txBytes]);
  }
}

export function createTatumSuiClient(config: TatumSuiClientConfig) {
  return new TatumSuiClient(config);
}
