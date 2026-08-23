const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL or SUPABASE_KEY not found in environment. Supabase client will be a stub.');
  // Export a minimal stub that matches the .from(...).select(...) pattern used by the server
  module.exports = {
    from: function(_table) {
      return {
        select: async function() {
          return { data: null, error: { message: 'Supabase client not configured (SUPABASE_URL or SUPABASE_KEY missing)' } };
        }
      };
    }
  };
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  module.exports = supabase;
}