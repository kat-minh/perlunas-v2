import { writeFileSync } from "node:fs";

// Generate a 16×16 32bpp .ico (emerald field + gold diamond), no deps.
const S = 16;
const emerald = [0x2c, 0x3a, 0x13]; // BGR of #133a2c
const gold = [0x46, 0x9b, 0xc3]; // BGR of #c39b46
const ivory = [0xe4, 0xf1, 0xf6]; // BGR of #f6f1e4

const px = Buffer.alloc(S * S * 4);
for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    const cx = x - 7.5;
    const cy = y - 7.5;
    const d = Math.abs(cx) + Math.abs(cy); // diamond distance
    let c = emerald;
    if (d < 3) c = ivory;
    else if (d < 6) c = gold;
    // BMP rows are bottom-up.
    const row = S - 1 - y;
    const i = (row * S + x) * 4;
    px[i] = c[0];
    px[i + 1] = c[1];
    px[i + 2] = c[2];
    px[i + 3] = 0xff;
  }
}
const andMask = Buffer.alloc(S * 2); // 16 bits/row → 2 bytes, all opaque (0)

const dib = Buffer.alloc(40);
dib.writeUInt32LE(40, 0);
dib.writeInt32LE(S, 4);
dib.writeInt32LE(S * 2, 8); // height doubled (XOR + AND)
dib.writeUInt16LE(1, 12);
dib.writeUInt16LE(32, 14);
dib.writeUInt32LE(0, 16);
dib.writeUInt32LE(px.length + andMask.length, 20);

const image = Buffer.concat([dib, px, andMask]);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const entry = Buffer.alloc(16);
entry[0] = S;
entry[1] = S;
entry[2] = 0;
entry[3] = 0;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(image.length, 8);
entry.writeUInt32LE(22, 12);

writeFileSync("src/app/favicon.ico", Buffer.concat([header, entry, image]));
console.log("favicon.ico written");
