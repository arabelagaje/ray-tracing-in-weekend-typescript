import * as fs from 'fs';
import { Color } from './src/Color.js';

const image_width = 256;
const image_height = 256;

// Render
let sData = "P3\n" + image_width + " " + image_height + "\n255\n";

for (let j = image_height - 1; j >= 0; --j) {
    console.log("Scanlines remaining: ", j)
    for (let i = 0; i < image_width; ++i) {
        let vec = new Color(i / (image_width - 1), j / (image_height - 1), 0.25)
        vec.multiplyBy(255.999);
       
        sData += Math.floor(vec.r) + ' ' + Math.floor(vec.g) + ' ' + Math.floor(vec.b) + "\n";
    }
}
fs.writeFileSync("./output/test.ppm", sData)
