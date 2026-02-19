import * as Linking from "expo-linking";

export function getRedirectUrl() {
  const url = Linking.createURL("auth/callback");
  console.log("=== REDIRECT URL FOR SUPABASE ===");
  console.log(url);
  console.log("=================================");
  return url;
}
