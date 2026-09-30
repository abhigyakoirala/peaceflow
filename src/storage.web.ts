import { Data, emptyData, parseData } from "./core";
const KEY = "peaceflow-preview-v1";
// Browser preview only. Native builds use a SQLCipher-encrypted local database.
export async function loadData(): Promise<Data> {
  const raw = localStorage.getItem(KEY);
  return raw ? parseData(raw) : emptyData();
}
export async function saveData(data: Data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
