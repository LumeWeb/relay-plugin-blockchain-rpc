import type { Plugin, RPCRequest } from "@lumeweb/relay";
import chainNetworks from "@lumeweb/pokt-rpc-endpoints";
import { PluginAPI } from "@lumeweb/relay";
function maybeMapChainId(chain: string): string | boolean {
  if (chain in chainNetworks) {
    return chainNetworks[chain];
  }

  if (
    [parseInt(chain, 16).toString(), parseInt(chain, 10).toString()].includes(
      chain.toLowerCase()
    )
  ) {
    return chain;
  }

  return false;
}

function reverseMapChainId(chainId: string): string | boolean {
  let vals = Object.values(chainNetworks);
  if (!vals.includes(chainId)) {
    return false;
  }

  return Object.keys(chainNetworks)[vals.indexOf(chainId)];
}
const plugin: Plugin = {
  name: "blockchain-rpc",
  async plugin(api: PluginAPI): Promise<void> {},
  exports: {
    networks: chainNetworks,
    async proxyRpcMethod(
      config: any,
      request: RPCRequest,
      chain: string,
      getProvider: (chainId: string) => Function
    ) {
      let chainId = maybeMapChainId(chain as string);

      if (!chainId) {
        throw new Error("INVALID_CHAIN");
      }
      chainId = reverseMapChainId(chainId as string);
      if (!chainId) {
        throw new Error("INVALID_CHAIN");
      }

      let resp;
      try {
        const provider = getProvider(chainId as string);
        resp = await provider(request.method, request.data);
      } catch (e: any) {
        e = e as Error;
        if ("error" in e) {
          throw e.error;
        }

        throw e;
      }

      return resp;
    },
  },
};

export default plugin;
