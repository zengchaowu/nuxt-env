import fs from "fs";
import path from "path";
import { exec } from "child_process";
import mkdirp from "@doraemon-module/nuxt-functions/lib/mkdirp";

export default async () => {
  const env = mkdirp(path.join(process.cwd(), "env"));
  const lib = mkdirp(path.join(env, "lib"));
  const files = fs.readdirSync(lib);
  let out = "";
  for (const file of files) {
    const name = path.parse(file).name;
    out += `import ${name} from './lib/${file}';`;
  }
  out += `let env = local;`;
  for (const file of files) {
    const name = path.parse(file).name;
    out += `if (process.env.APP_ENV === '${name}') env = ${name};`;
  }
  out += `const out = env; export default out;`;
  const index = path.join(env, "index.js");
  fs.writeFileSync(index, out);
  exec("yarn lintfix");
};
