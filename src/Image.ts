import { Color } from "./Color.js";
import * as fs from 'fs';
import Jimp from "jimp";

export class Image {
    data: Array<Array<Color>> = [];
    constructor(private _width: number, private _height: number) {
        for (let i = 0; i < _width; i++) {
            this.data[i] = [];
            for (let j = 0; j < _height; j++) {
                this.data[i][j] = new Color(0, 0, 0);
            }
        }
    }

    get width() {
        return this.width;
    }

    get height() {
        return this.height;
    }

    setColor(i: number, j: number, color: Color) {
        this.data[i][j] = color;
    }

    savePPM() {
        let imgData = "P3\n" + this._width + " " + this._height + "\n255\n";
        for (let j = this._height - 1; j >= 0; --j) {
            for (let i = 0; i < this._width; i++) {
                let pixel_color = this.data[i][j];
                imgData += Math.floor(pixel_color.x) + ' ' + Math.floor(pixel_color.y) + ' ' + Math.floor(pixel_color.z) + "\n";
            }
        }
        fs.writeFile('output/image.ppm', imgData, function (err: any) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    savePNG() {
        let pngImg = new Jimp(this._width, this._height, (err, image) => {
            if (err) throw err;
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    let pixel_color = this.data[i][j];
                    pixel_color.clamp(0, 255)
                    image.setPixelColor(Jimp.rgbaToInt(pixel_color.r, pixel_color.g, pixel_color.b, 255), i, this._height - j)
                }
            }
            image.write('output/image.png', (err) => {
                if (err) throw err;
                console.log('image saved');
            });
        });
    }
}