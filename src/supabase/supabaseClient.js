import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cqbobtltcvwfeskghmwe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYm9idGx0Y3Z3ZmVza2dobXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNjQ3MDEsImV4cCI6MjA0MTc0MDcwMX0.frn6Wstg0keQecVvpiAn5mevWG04L-tBCg2J9gKLpjQ';
export const supabase = createClient(supabaseUrl, supabaseKey);
