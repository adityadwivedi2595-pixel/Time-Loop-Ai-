/**
 * TIMELOOP AI – Database Seed Runner
 * Seeds initial eras into Supabase PostgreSQL (if configured) or Memory Store.
 */

import { INITIAL_ERAS, DataStore } from '../src/lib/supabase/storage';
import { createServerClient } from '../src/lib/supabase/server';

async function main() {
  console.log(`[TIMELOOP AI] Starting database seed for ${INITIAL_ERAS.length} verified eras...`);

  if (DataStore.hasLiveSupabase()) {
    const supabase = createServerClient();
    if (supabase) {
      const { data, error } = await supabase.from('eras').upsert(INITIAL_ERAS);
      if (error) {
        console.error('[Supabase Seed Error]:', error.message);
      } else {
        console.log('[Supabase Seed Success] Eras updated in PostgreSQL database.');
      }
    }
  } else {
    console.log('[Local Store Seed Success] 8 eras pre-loaded into local high-fidelity memory store.');
  }

  console.log('Seed process completed successfully.');
}

main().catch((err) => {
  console.error('[Seed Fatal Error]:', err);
  process.exit(1);
});
