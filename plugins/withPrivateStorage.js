const {
  withAppDelegate,
  withAndroidManifest,
  withDangerousMod,
} = require("expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");
module.exports = function withPrivateStorage(config) {
  config = withAppDelegate(config, (c) => {
    if (c.modResults.language !== "swift")
      throw new Error(
        "Peaceflow private-storage plugin requires a Swift AppDelegate.",
      );
    const marker = "// Peaceflow: exclude private records from device backups";
    if (!c.modResults.contents.includes(marker)) {
      const anchor = "let delegate = ReactNativeDelegate()";
      if (!c.modResults.contents.includes(anchor))
        throw new Error(
          "AppDelegate changed: review the backup exclusion insertion.",
        );
      c.modResults.contents = c.modResults.contents.replace(
        anchor,
        `${marker}
    do {
      var privateURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("peaceflow-private", isDirectory: true)
      try FileManager.default.createDirectory(at: privateURL, withIntermediateDirectories: true)
      var values = URLResourceValues()
      values.isExcludedFromBackup = true
      try privateURL.setResourceValues(values)
    } catch {
      fatalError("Unable to prepare private storage")
    }
    ${anchor}`,
      );
    }
    return c;
  });
  config = withAndroidManifest(config, (c) => {
    const app = c.modResults.manifest.application[0].$;
    app["android:allowBackup"] = "false";
    app["android:fullBackupContent"] = "@xml/peaceflow_backup_rules";
    app["android:dataExtractionRules"] = "@xml/peaceflow_extraction_rules";
    return c;
  });
  return withDangerousMod(config, [
    "android",
    async (c) => {
      const dir = path.join(
        c.modRequest.platformProjectRoot,
        "app/src/main/res/xml",
      );
      fs.mkdirSync(dir, { recursive: true });
      const excludes = ["root", "file", "database", "sharedpref", "external"]
        .map((d) => `<exclude domain="${d}" path="."/>`)
        .join("");
      fs.writeFileSync(
        path.join(dir, "peaceflow_backup_rules.xml"),
        `<?xml version="1.0" encoding="utf-8"?><full-backup-content>${excludes}</full-backup-content>`,
      );
      fs.writeFileSync(
        path.join(dir, "peaceflow_extraction_rules.xml"),
        `<?xml version="1.0" encoding="utf-8"?><data-extraction-rules><cloud-backup>${excludes}</cloud-backup><device-transfer>${excludes}</device-transfer></data-extraction-rules>`,
      );
      return c;
    },
  ]);
};
