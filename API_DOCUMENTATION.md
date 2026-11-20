# TIMELOOP AI – REST API & MCP Tool Contracts

All backend endpoints accept and return `application/json`.

---

## 1. AI Generation Endpoints

### `POST /api/ai/generate-character`
Generates a structured character profile and concept portrait.
- **Request Body**:
  ```json
  {
    "eraName": "Cyberpunk Future",
    "role": "Time Traveller",
    "customSeed": "A cynical chronomancer seeking lost archives"
  }
  ```
- **Response**:
  ```json
  {
    "character": {
      "id": "char-12345",
      "name": "Zephyr Vance",
      "role": "Time Traveller",
      "personality": ["Analytical", "Inquisitive"],
      "appearance": "...",
      "backstory": "...",
      "abilities": ["Temporal Flux Perception"],
      "visual_prompt": "...",
      "image_url": "https://..."
    }
  }
  ```

### `POST /api/ai/generate-story`
Initializes a new interactive story in the target era.
- **Request Body**:
  ```json
  {
    "eraId": "ancient-india",
    "characterId": "char-12345",
    "genre": "Adventure",
    "tone": "Cinematic & Gritty",
    "customInstructions": "Focus on palace court intrigues"
  }
  ```
- **Response**:
  ```json
  {
    "story": { "id": "story-123", "title": "The Chrono-Sutra", ... },
    "chapter": { "id": "chap-1", "title": "Chapter 1: The Brass Anomaly" },
    "scene": { "id": "scene-1", "title": "Echoes by the River", "choices": [...] }
  }
  ```

### `POST /api/ai/continue-story`
Progresses story narrative after player decision.
- **Request Body**:
  ```json
  {
    "storyId": "story-123",
    "sceneId": "scene-1",
    "choiceId": "c1",
    "branchId": "main"
  }
  ```
- **Response**:
  ```json
  {
    "nextScene": { "id": "scene-2", "title": "The Audience Hall", ... },
    "updatedState": {
      "current_chapter": 1,
      "current_scene_number": 2,
      "relationships": { "Emperor": 65 },
      "flags": { "revealed_signet": true },
      "resources": { "influence": 35 }
    },
    "eligibleEndings": [],
    "isBranchForked": false
  }
  ```

### `POST /api/ai/generate-alternate-timeline`
Simulates counterfactual historical consequences.
- **Request Body**:
  ```json
  {
    "whatIfPrompt": "What if dinosaurs survived and evolved high-order sentience?"
  }
  ```

### `POST /api/ai/generate-poster`
Generates theatrical teaser poster specs and artwork.
- **Request Body**:
  ```json
  {
    "storyTitle": "The Chrono-Sutra",
    "genre": "Adventure",
    "eraName": "Ancient India",
    "character": "Arjun Thorne",
    "tagline": "History remembers the brave."
  }
  ```

---

## 2. Core Story & Timeline Endpoints

- `GET /api/stories`: List authenticated user's stories.
- `GET /api/stories/[id]`: Retrieve story details.
- `GET /api/stories/[id]/timeline`: Retrieve full branching decision graph and active strand.
- `POST /api/stories/[id]/decisions`: Submit a decision node and evaluate state transitions.

---

## 3. MCP Tool Execution Endpoint

### `POST /api/mcp`
Invokes an internal MCP tool using verified session identity.
- **Request Body**:
  ```json
  {
    "tool": "get_story_state",
    "arguments": {
      "story_id": "story-123",
      "branch_id": "main"
    }
  }
  ```
- **Response**:
  ```json
  {
    "content": [
      {
        "type": "text",
        "text": "{\"story_id\":\"story-123\",\"timeline_state\":{...}}"
      }
    ],
    "isError": false
  }
  ```
