import fs from "fs";
import path from "path";
import mkdirp from "@doraemon-module/nuxt-functions/lib/mkdirp";

export default async () => {
  const env = mkdirp(path.join(process.cwd(), "env"));

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
