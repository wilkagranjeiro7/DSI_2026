import { SupabaseClient, createClient } from "@supabase/supabase-js";

class SupabaseEnvironment {
  static read() {
    return {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
      anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
    };
  }
}

class SupabaseClientFactory {
  create(): SupabaseClient {
    const environment = SupabaseEnvironment.read();

    if (!environment.url || !environment.anonKey) {
      console.warn(
        "Chaves do Supabase nao encontradas. Verifique o arquivo .env",
      );
    }

    return createClient(environment.url, environment.anonKey);
  }
}

export const supabase = new SupabaseClientFactory().create();
