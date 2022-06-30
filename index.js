import fs from "fs";
import path from "path";
import copy from "@doraemon-module/nuxt-functions/lib/copy";
import mkdirp from "@doraemon-module/nuxt-functions/lib/mkdirp";
import { dirname } from "path";
import { fileURLToPath } from "url";

export default async () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const env = mkdirp(path.join(process.cwd(), "env"));
  copy(path.join(__dirname, "lib", "_gitignore"), path.join(env, ".gitignore"));

  const lib = mkdirp(path.join(env, "lib"));
  copy(path.join(__dirname, "lib", "dev.js"), path.join(lib, "dev.js"));
  copy(path.join(__dirname, "lib", "local.js"), path.join(lib, "local.js"));
  copy(path.join(__dirname, "lib", "main.js"), path.join(lib, "main.js"));

  const files = fs.readdirSync(lib);
  let out = "";
  for (const file of files) {
    const name = path.parse(file).name;
    out += `import ${name} from './lib/${file}';`;
  }
  out += `let env = local;`;
  for (const file of files) {
    const name = path.parse(file).name;
    out += `if (process.env.NODE_ENV === '${name}') env = ${name};`;
  }
  out += `module.exports = env;`;
  const index = path.join(env, "index.js");
  fs.writeFileSync(index, out);
};
