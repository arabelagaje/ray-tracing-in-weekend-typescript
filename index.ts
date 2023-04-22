import * as fs from 'fs';
const image_width = 256;
const image_height = 256;

// Render
let sData = "P3\n" + image_width + " " + image_height + "\n255\n";

for (let j = image_height - 1; j >= 0; --j) {
    console.log("Scanlines remaining: ", j)
    for (let i = 0; i < image_width; ++i) {
        const r = i / (image_width - 1);
        const g = j / (image_height - 1);
        const b = 0.25;

        const ir = Math.floor(255.999 * r);
        const ig = Math.floor(255.999 * g);
        const ib = Math.floor(255.999 * b);

        sData += ir + ' ' + ig + ' ' + ib + "\n";
    }
}
fs.writeFileSync("./output/test.ppm", sData)
