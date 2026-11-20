import { describe, it, expect } from 'vitest';
import { MCPToolHandlers } from '@/lib/mcp/tools';
import { createTimeloopMcpServer } from '@/lib/mcp/server';

describe('Model Context Protocol (MCP) Server & 12 Tools', () => {
  const testUserId = '00000000-0000-0000-0000-000000000001';

  it('initializes the official McpServer with all registered tools', () => {
    const server = createTimeloopMcpServer(testUserId);
    expect(server).toBeDefined();
  });

  it('tool 1: get_era_details returns verified era info', async () => {
    const era = await MCPToolHandlers.get_era_details({ era_id: 'ancient-india' });
    expect(era.name).toContain('Ancient India');
    expect(era.classification).toBe('historical');
  });

  it('tool 3: create_story creates a valid story in storage', async () => {
    const story = await MCPToolHandlers.create_story(
      {
        era_id: 'cyberpunk-future',
        title: 'Neon Odyssey',
        genre: 'Science Fiction',
        tone: 'Cinematic & Gritty',
        story_summary: 'In the shadows of Neo-Kowloon.',
      },
      testUserId
    );
    expect(story.id).toBeDefined();
    expect(story.title).toBe('Neon Odyssey');
  });

  it('tool 8: generate_scene_image returns image result', async () => {
    const res = await MCPToolHandlers.generate_scene_image({
      visual_prompt: 'High-tech cybernetics laboratory',
      era_id: 'cyberpunk-future',
    });
    expect(res.imageUrl).toBeDefined();
    expect(res.isPreview).toBe(true);
  });

  it('tool 12: get_user_library returns player assets', async () => {
    const lib = await MCPToolHandlers.get_user_library({ filter_type: 'all' }, testUserId);
    expect(lib.stories).toBeDefined();
    expect(lib.characters).toBeDefined();
  });
});
