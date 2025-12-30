import admin from "firebase-admin";

export function setupFirebase(secretServiceAccountPath: string) {
  const app = admin.initializeApp({
    credential: admin.credential.cert(secretServiceAccountPath),
  });
  return app;
}
