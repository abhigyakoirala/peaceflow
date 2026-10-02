import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { Directory, Paths } from "expo-file-system";
import { Data, emptyData, parseData } from "./core";
let opening: Promise<SQLite.SQLiteDatabase> | undefined;
function database() {
  if (!opening)
    opening = (async () => {
      const directory = new Directory(Paths.document, "peaceflow-private");
      directory.create({ idempotent: true, intermediates: true });
      const keyName = "peaceflow-database-key-v1";
      let key = await SecureStore.getItemAsync(keyName);
      if (!key) {
        key = Array.from(await Crypto.getRandomBytesAsync(32))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        await SecureStore.setItemAsync(keyName, key, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
      }
      if (!/^[a-f0-9]{64}$/.test(key))
        throw new Error("The local encryption key is invalid.");
      const db = await SQLite.openDatabaseAsync(
        "peaceflow.db",
        {},
        directory.uri,
      );
      await db.execAsync(`PRAGMA key = "x'${key}'";`);
      const cipher = await db.getFirstAsync("PRAGMA cipher_version;");
      if (!cipher) {
        await db.closeAsync();
        throw new Error(
          "Encrypted storage requires a Paceflow development build. Expo Go is not supported.",
        );
      }
      await db.execAsync(
        "PRAGMA secure_delete = ON; CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK (id=1), value TEXT NOT NULL);",
      );
      return db;
    })().catch((error) => {
      opening = undefined;
      throw error;
    });
  return opening;
}
export async function loadData(): Promise<Data> {
  const db = await database();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_state WHERE id=1",
  );
  return row ? parseData(row.value) : emptyData();
}
export async function saveData(data: Data) {
  const db = await database();
  await db.runAsync(
    "INSERT INTO app_state (id,value) VALUES (1,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value",
    JSON.stringify(data),
  );
}
