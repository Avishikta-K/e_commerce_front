// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyqmmrjgscazovrzoryv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5cW1tcmpnc2Nhem92cnpvcnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1OTYyOTIsImV4cCI6MjA4NTE3MjI5Mn0.xJAqdikInnEuuaHm48wIts9QaSH3xBMdnIhCjFh8MVY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);