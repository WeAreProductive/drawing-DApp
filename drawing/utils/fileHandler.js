const encoder = new TextEncoder();
const decoder = new TextDecoder();

// @TODO remove the unused functions

export async function mkdir() {
  const path = `./test_mkdir${tjs.pid}`;
  const s_irwxu = 0o700;
  const s_ifmt = ~0o777;
  await tjs.mkdir(path, { mode: s_irwxu });
  const result = await tjs.stat(path);
}
export async function mkstemp() {
  const f = await tjs.mkstemp("test_file1XXXXXX");
  await f.write(encoder.encode("hello world"));
  await f.close();
}

export async function readWrite(data) {
  const f = await tjs.mkstemp("./pic/test_filerwXXXXXX");
  const path = f.path;
  await f.write(encoder.encode(`${data}`));
  await f.close();
  console.log(path);
  tjs.copyfile(`${path}`, `${path}.svg`);
  //@TODO - delete the tmp file
}

export const fileHandler = async (data) => {
  const dirIter = await tjs.readdir("./tmp");
  for await (const item of dirIter) {
    console.log(item.name);
    const f = await tjs.mkstemp("./tmp/test_filerwXXXXXX");
    console.log(f.path);
    tjs.copyfile(f.path, `${f.path}.svg`);
  }
};
