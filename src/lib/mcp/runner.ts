#!/usr/bin/env node
/**
 * Standalone MCP Server Runner (Stdio Transport)
 * Runs over stdio for external MCP host connections (e.g. Claude Desktop, Agent IDEs).
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createTimeloopMcpServer } from './server';

async function main() {
  const server = createTimeloopMcpServer('00000000-0000-0000-0000-000000000001');
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error('[TIMELOOP AI] Model Context Protocol Server active on stdio transport.');
}

main().catch((err) => {
  console.error('[TIMELOOP AI MCP Server Error]:', err);
  process.exit(1);
});
