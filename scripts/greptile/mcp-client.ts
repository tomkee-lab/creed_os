/**
 * Greptile MCP Client & Verification Utility
 * 
 * Verifies connectivity to the Greptile Model Context Protocol (MCP) server
 * at https://api.greptile.com/mcp and provides testing helpers.
 */

const GREPTILE_MCP_ENDPOINT = process.env.GREPTILE_MCP_ENDPOINT || 'https://api.greptile.com/mcp';
const API_KEY = process.env.GREPTILE_API_KEY;

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse<T = unknown> {
  jsonrpc: '2.0';
  id: string | number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export async function pingGreptileMcp(): Promise<{ ok: boolean; status: number; message: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (API_KEY) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    const res = await fetch(GREPTILE_MCP_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      } satisfies JsonRpcRequest)
    });

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        status: res.status,
        message: 'Endpoint reachable, authentication required (OAuth login or GREPTILE_API_KEY).'
      };
    }

    const data = await res.json() as JsonRpcResponse;
    return {
      ok: res.ok,
      status: res.status,
      message: res.ok ? 'Greptile MCP endpoint connected successfully.' : (data.error?.message || res.statusText)
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      status: 0,
      message: `Failed to reach Greptile MCP: ${message}`
    };
  }
}

// CLI execution
console.log(`Connecting to Greptile MCP at: ${GREPTILE_MCP_ENDPOINT}...`);
pingGreptileMcp().then(res => {
  console.log(`Status: [${res.status}] ${res.message}`);
  if (!API_KEY) {
    console.log('\nTip: To authenticate via API key in CLI/CI, set GREPTILE_API_KEY in .env.local');
    console.log('For IDEs (Cursor/Claude/Antigravity), OAuth login will prompt automatically on first tool call.');
  }
});
