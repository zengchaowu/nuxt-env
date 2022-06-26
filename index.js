import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

export default async () => {
  const root = path.join(process.cwd(), "env");
  mkdirp.sync(root);
  const index = path.join(root, "index.js");
  const ignore = path.join(root, ".gitignore");
  fs.writeFileSync(ignore, "/index.js");
  const lib = path.join(root, "lib");
  mkdirp.sync(lib);
  const local = path.join(lib, "local.js");
  fs.stat(local, function (err, stat) {
    if (stat && stat.isFile()) {
      console.log(`${local}存在`);
    } else {
      fs.writeFileSync(local, "export default {}");
    }
  });
  const dev = path.join(lib, "dev.js");
  fs.stat(dev, function (err, stat) {
    if (stat && stat.isFile()) {
      console.log(`${dev}存在`);
    } else {
      fs.writeFileSync(dev, "export default {}");
    }
  });
  const main = path.join(lib, "main.js");
  fs.stat(main, function (err, stat) {
    if (stat && stat.isFile()) {
      console.log(`${main}存在`);
    } else {
      fs.writeFileSync(main, "export default {}");
    }
  });
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
  fs.writeFileSync(index, out);
};
