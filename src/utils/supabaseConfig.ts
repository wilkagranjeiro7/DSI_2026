import { createClient } from '@supabase/supabase-js';

// O process.env busca os valores automaticamente dentro do seu arquivo .env único
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Chaves do Supabase não encontradas! Verifique o seu arquivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);