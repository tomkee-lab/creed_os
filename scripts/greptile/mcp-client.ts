/**
 * Greptile MCP Client & Verification Utility
 * 
 * Verifies connectivity to the Greptile Model Context Protocol (MCP) server
 * at https://api.greptile.com/mcp and provides testing helpers.
 */

import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';

// Helper to load .env.local if not already loaded in process.env
function loadEnvLocal() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=');
          const k = key.trim();
          const v = values.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[k]) {
            process.env[k] = v;
          }
        }
      }
    }
  } catch (err: unknown) {
    console.warn(`[env] Notice: Unable to load .env.local: ${err instanceof Error ? err.message : String(err)}`);
  }
}

loadEnvLocal();

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

export async function callGreptileTool(name: string, args: Record<string, unknown> = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  }

  try {
    const res = await fetch(GREPTILE_MCP_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name,
          arguments: args
        }
      } satisfies JsonRpcRequest)
    });

    if (!res.ok) {
      const errorText = await res.text();
      const errorMsg = `[mcp-client] HTTP ${res.status} ${res.statusText} while calling tool "${name}": ${errorText}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const data = await res.json() as JsonRpcResponse<{ content: Array<{ type: string; text: string }> }>;
    if (data.error) {
      const rpcErrorMsg = `[mcp-client] JSON-RPC error from tool "${name}" (code ${data.error.code}): ${data.error.message}`;
      console.error(rpcErrorMsg, data.error.data ?? '');
      throw new Error(rpcErrorMsg);
    }

    return data;
  } catch (err: unknown) {
    console.error(`[mcp-client] Async failure invoking tool "${name}": ${err instanceof Error ? err.message : String(err)}`);
    throw err;
  }
}

// CLI execution
async function main() {
  console.log(`\n========================================`);
  console.log(`CREED OS — Greptile MCP Diagnostic Suite`);
  console.log(`========================================\n`);
  console.log(`Endpoint: ${GREPTILE_MCP_ENDPOINT}`);

  const ping = await pingGreptileMcp();
  console.log(`Connection Status: [HTTP ${ping.status}] ${ping.message}`);

  if (API_KEY) {
    console.log(`API Key: Authenticated (mask: ${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)})`);
    
    // Whoami
    const whoami = await callGreptileTool('get_me');
    const whoamiText = whoami.result?.content?.[0]?.text;
    if (whoamiText) {
      const parsed = JSON.parse(whoamiText);
      console.log(`\nAccount Type: ${parsed.principal?.type}`);
      if (parsed.organizations?.length) {
        console.log(`Organizations:`);
        for (const org of parsed.organizations) {
          console.log(`  - ${org.name} (handle: ${org.handle}, id: ${org.id})`);
        }
      }
    }

    // Repositories
    const repos = await callGreptileTool('list_repositories', {});
    const reposText = repos.result?.content?.[0]?.text;
    if (reposText) {
      const parsed = JSON.parse(reposText);
      console.log(`\nEnrolled Repositories (${parsed.total}):`);
      for (const repo of parsed.repositories || []) {
        console.log(`  - ${repo.name} [${repo.remote}] (branch: ${repo.defaultBranch}, reviews: ${repo.reviewsEnabled ? 'ENABLED' : 'DISABLED'})`);
      }
    }

    // Custom Context / Rules
    const context = await callGreptileTool('list_custom_context', {});
    const contextText = context.result?.content?.[0]?.text;
    if (contextText) {
      const parsed = JSON.parse(contextText);
      console.log(`\nActive Custom Context / Team Standards (${parsed.total}):`);
      for (const item of parsed.customContexts || []) {
        console.log(`  - [${item.status}] ${item.body?.slice(0, 80)}...`);
      }
    }

    // Pull Requests
    console.log(`\nChecking Pull Requests for tomkee-lab/creed_os via Greptile MCP...`);
    const prs = await callGreptileTool('list_pull_requests', {
      name: 'tomkee-lab/creed_os',
      remote: 'github',
      defaultBranch: 'main'
    });
    const prsText = prs.result?.content?.[0]?.text;
    if (prsText) {
      const parsed = JSON.parse(prsText);
      const mrList = parsed.mergeRequests || [];
      console.log(`Active Pull Requests in Greptile (${mrList.length}):`);
      for (const pr of mrList) {
        console.log(`  - PR #${pr.number}: "${pr.title}" (state: ${pr.state})`);
      }

      if (mrList.length > 0) {
        const prNum = mrList[0].number;
        console.log(`\nFetching Greptile Review Details for PR #${prNum}...`);
        const details = await callGreptileTool('get_merge_request', {
          name: 'tomkee-lab/creed_os',
          remote: 'github',
          defaultBranch: 'main',
          prNumber: prNum
        });
        const detailsText = details.result?.content?.[0]?.text;
        if (detailsText) {
          try {
            const parsed = JSON.parse(detailsText);
            const mr = parsed.mergeRequest;
            console.log(`PR #${prNum} Title: ${mr?.title}`);
            console.log(`Status: ${mr?.state}`);
            console.log(`Reviews Count: ${mr?.codeReviews?.length || 0}`);
            if (mr?.reviewAnalysis) {
              console.log(`Review Completeness: ${mr.reviewAnalysis.reviewCompleteness || 'In Progress'}`);
              const unaddressed = mr.reviewAnalysis.unaddressedComments || [];
              console.log(`Unaddressed Comments: ${unaddressed.length}`);
            }
          } catch {
            console.log('Response:', detailsText);
          }
        }
      }
    }
  } else {
    console.log(`\nTip: To authenticate via API key in CLI/CI, set GREPTILE_API_KEY in .env.local`);
    console.log(`For IDEs (Cursor/Claude/Antigravity), OAuth login will prompt automatically on first tool call.`);
  }

  console.log(`\nDiagnostic complete.\n`);
}

main().catch(err => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
