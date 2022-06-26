import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import camelcase from "camelcase";

export default async () => {
  const root = path.join(process.cwd(), "env");
  mkdirp.sync(root);
  const index = path.join(root, "index.js");
  const ignore = path.join(root, ".gitignore");
  fs.writeFileSync(ignore, "/index.js");
  const lib = path.join(root, "lib");
  mkdirp.sync(lib);
  const local = path.join(lib, "local.js");
  fs.writeFileSync(local, "export default {}");
  const dev = path.join(lib, "dev.js");
  fs.writeFileSync(dev, "export default {}");
  const main = path.join(lib, "main.js");
  fs.writeFileSync(main, "export default {}");
  const files = fs.readdirSync(lib);
  const out = {};
  for (const file of files) {
    const list = await import(path.join(lib, file));
    const dic = {};
    list.default.forEach((item) => {
      dic["$" + camelcase(item, { pascalCase: true }) + "$"] = path.join(
        path.parse(file).name,
        item
      );
    });
    out["$" + camelcase(path.parse(file).name, { pascalCase: true }) + "$"] =
      dic;
  }
  let json = JSON.stringify(out);
  json = json.replaceAll('$"', "");
  json = json.replaceAll('"$', "");
  fs.writeFileSync(
    index,
    'import EventEmitter from "events"; export const emitter = new EventEmitter(); export default ' +
      json
  );
};
