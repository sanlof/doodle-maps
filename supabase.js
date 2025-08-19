// supabase connection

import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://dmwuubkprzexnzxohrmo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtd3V1YmtwcnpleG56eG9ocm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODc0NTcsImV4cCI6MjA3MTE2MzQ1N30.bjbD6Ow6iW7b8N5u1oibkH1N_bP4xh3z2dzTUpJAmuc";

export const supabase = createClient(supabaseUrl, supabaseKey);
