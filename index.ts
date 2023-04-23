import * as fs from 'fs';
import { Ray } from './src/Ray.js';
import { Vector3 } from './src/Vector3.js';
import { Color } from './src/Color.js';
import { Point3 } from './src/Point3.js';

console.time("Total time")

const aspect_ratio = 16.0 / 9.0;
const image_width = 400;
const image_height = Math.floor(image_width / aspect_ratio);

const viewport_height = 2.0;
const viewport_width = aspect_ratio * viewport_height;
const focal_length = 1.0;

const origin = new Point3(0, 0, 0);
const horizontal = new Vector3(viewport_width, 0, 0);
const vertical = new Vector3(0, viewport_height, 0);
//origin - horizontal/2 - vertical/2 - Vector3(0, 0, focal_length);
const lower_left_corner = origin.subtract(horizontal.divide(2)).subtract(vertical.divide(2)).subtract(new Vector3(0, 0, focal_length));


// Render
let imgData = "P3\n" + image_width + " " + image_height + "\n255\n";

for (let j = image_height - 1; j >= 0; --j) {
    console.log("Scanlines remaining: ", j)
    for (let i = 0; i < image_width; ++i) {
        const u = i / (image_width - 1);
        const v = j / (image_height - 1);
        //lower_left_corner + u*horizontal + v*vertical - origin
        const r = new Ray(origin,
            lower_left_corner.add(horizontal.multiply(u)).add(vertical.multiply(v)).subtract(origin));
        const pixel_color = rayColor(r);

        pixel_color.multiplyBy(255.999);
        imgData += Math.floor(pixel_color.r) + ' ' + Math.floor(pixel_color.g) + ' ' + Math.floor(pixel_color.b) + "\n";
    }
}

function rayColor(r: Ray): Color {
    let t = hit_sphere(new Point3(0,0,-1), 0.5, r);
    if (t > 0.0) {
        const N = r.at(t).subtract(new Vector3(0,0,-1)).getNormalized();
        return Color.fromVector3(new Color(N.x+1, N.y+1, N.z+1).multiply(0.5));
    }
    const unit_direction = r.direction.getNormalized();
    t = 0.5 * (unit_direction.y + 1.0);
    const startColor = new Color(1.0, 1.0, 1.0);
    const endColor = new Color(0.5, 0.7, 1.0);
    //(1.0-t) * startColor + t * endColor;
    return Color.fromVector3(startColor.multiply(1 - t).add(endColor.multiply(t)));
}

function hit_sphere(center: Point3, radius: number, r: Ray) {
    const oc = r.origin.subtract(center);
    const a = r.direction.dot(r.direction);
    const b = 2.0 * oc.dot(r.direction);
    const c = oc.dot(oc) - radius * radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return -1.0;
    } else {
        return (-b - Math.sqrt(discriminant)) / (2.0 * a);
    }
}

fs.writeFileSync("./output/test.ppm", imgData)

console.timeEnd("Total time")