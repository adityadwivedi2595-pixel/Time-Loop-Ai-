/**
 * TIMELOOP AI – MCP Server Registration
 * Configures the Model Context Protocol Server with all 12 registered tools using @modelcontextprotocol/sdk
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  GetEraDetailsSchema,
  GetCharacterProfileSchema,
  CreateStorySchema,
  GetStoryStateSchema,
  SaveStorySceneSchema,
  SaveStoryChoiceSchema,
  UpdateTimelineStateSchema,
  GenerateSceneImageSchema,
  GenerateMoviePosterSchema,
  GetAvailableEndingsSchema,
  SaveStoryEndingSchema,
  GetUserLibrarySchema,
  MCPToolHandlers,
} from './tools';

export function createTimeloopMcpServer(authenticatedUserId: string = '00000000-0000-0000-0000-000000000001') {
  const server = new McpServer({
    name: 'timeloop-ai-engine',
    version: '1.0.0',
  });

  // 1. get_era_details
  server.registerTool(
    'get_era_details',
    {
      description: 'Fetch world-building lore and suggested roles for a specific time era',
      inputSchema: GetEraDetailsSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.get_era_details(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 2. get_character_profile
  server.registerTool(
    'get_character_profile',
    {
      description: 'Retrieve full character profile, attributes, and background',
      inputSchema: GetCharacterProfileSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.get_character_profile(args as any, authenticatedUserId);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 3. create_story
  server.registerTool(
    'create_story',
    {
      description: 'Initialize a new story in the chosen era with selected character',
      inputSchema: CreateStorySchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.create_story(args as any, authenticatedUserId);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 4. get_story_state
  server.registerTool(
    'get_story_state',
    {
      description: 'Get current timeline state, relationship scores, and flags',
      inputSchema: GetStoryStateSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.get_story_state(args as any, authenticatedUserId);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 5. save_story_scene
  server.registerTool(
    'save_story_scene',
    {
      description: 'Persist a generated scene, dialogues, and branching choices',
      inputSchema: SaveStorySceneSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.save_story_scene(args as any, authenticatedUserId);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 6. save_story_choice
  server.registerTool(
    'save_story_choice',
    {
      description: 'Record an available player decision node',
      inputSchema: SaveStoryChoiceSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.save_story_choice(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 7. update_timeline_state
  server.registerTool(
    'update_timeline_state',
    {
      description: 'Apply validated state mutations (relationships, resources, flags)',
      inputSchema: UpdateTimelineStateSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.update_timeline_state(args as any, authenticatedUserId);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 8. generate_scene_image
  server.registerTool(
    'generate_scene_image',
    {
      description: 'Generate or retrieve visual scene artwork',
      inputSchema: GenerateSceneImageSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.generate_scene_image(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 9. generate_movie_poster
  server.registerTool(
    'generate_movie_poster',
    {
      description: 'Create cinematic movie poster artwork for an adventure',
      inputSchema: GenerateMoviePosterSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.generate_movie_poster(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 10. get_available_endings
  server.registerTool(
    'get_available_endings',
    {
      description: 'Evaluate story state to check unlockable endings',
      inputSchema: GetAvailableEndingsSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.get_available_endings(args as any, authenticatedUserId);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 11. save_story_ending
  server.registerTool(
    'save_story_ending',
    {
      description: 'Persist unlocked story ending to player archive',
      inputSchema: SaveStoryEndingSchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.save_story_ending(args as any, authenticatedUserId);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // 12. get_user_library
  server.registerTool(
    'get_user_library',
    {
      description: 'Fetch user adventures, characters, and saved checkpoints',
      inputSchema: GetUserLibrarySchema.shape,
    },
    async (args) => {
      const data = await MCPToolHandlers.get_user_library(args as any, authenticatedUserId);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  return server;
}
