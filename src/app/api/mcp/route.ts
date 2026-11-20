import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { MCPToolHandlers } from '@/lib/mcp/tools';

/**
 * Authenticated MCP Tool Execution Endpoint
 * Exposes internal MCP tools safely to authenticated callers.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const { tool, arguments: args } = await req.json();

    if (!tool || typeof tool !== 'string') {
      return NextResponse.json({ error: 'tool name is required' }, { status: 400 });
    }

    const handler = (MCPToolHandlers as any)[tool];
    if (!handler || typeof handler !== 'function') {
      return NextResponse.json({ error: `Unknown MCP tool: ${tool}` }, { status: 404 });
    }

    console.log(`[MCP Tool Invoked] User: ${user.id} | Tool: ${tool}`);
    const result = await handler(args || {}, user.id);

    return NextResponse.json({
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
      isError: false,
    });
  } catch (err: any) {
    console.error('[MCP Tool Error]:', err);
    return NextResponse.json({
      content: [
        {
          type: 'text',
          text: err.message || 'Tool execution failed',
        },
      ],
      isError: true,
    }, { status: 500 });
  }
}
