import * as fs from 'fs';
import { Ray } from './src/Ray.js';
import { Vector3 } from './src/Vector3.js';
import { Color } from './src/Color.js';
import { Point3 } from './src/Point3.js';
import { Hitable } from './src/Hitable.js';
import { HitableList } from './src/HitableList.js';
import { Sphere } from './src/Sphere.js';

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

const world = new HitableList();
world.add(new Sphere(new Point3(0,0,-1), 0.5));
world.add(new Sphere(new Point3(0,-100.5,-1), 100));

// Render
let imgData = "P3\n" + image_width + " " + image_height + "\n255\n";

for (let j = image_height - 1; j >= 0; --j) {
    console.log("Scanlines remaining: ", j)
    for (let i = 0; i < image_width; ++i) {
        const u = i / (image_width - 1);
        const v = j / (image_height - 1);
        //lower_left_corner + u*horizontal + v*vertical - origin
        const ray = new Ray(origin,
            lower_left_corner.add(horizontal.multiply(u)).add(vertical.multiply(v)).subtract(origin));
        const pixel_color = rayColor(ray,world);

        pixel_color.multiplyBy(255.999);
        imgData += Math.floor(pixel_color.r) + ' ' + Math.floor(pixel_color.g) + ' ' + Math.floor(pixel_color.b) + "\n";
    }
}

function rayColor(ray: Ray, world:Hitable): Color {
    const hitRecord = world.hit(ray, 0, Number.MAX_SAFE_INTEGER)
    if(hitRecord.isHit){
        return Color.fromVector3(hitRecord.normal.add(new Vector3(1,1,1)).multiply(0.5));
    }
    const unit_direction = ray.direction.getNormalized();
    const t = 0.5 * (unit_direction.y + 1.0);
    const startColor = new Color(1.0, 1.0, 1.0);
    const endColor = new Color(0.5, 0.7, 1.0);
    //(1.0-t) * startColor + t * endColor;
    return Color.fromVector3(startColor.multiply(1 - t).add(endColor.multiply(t)));
}

function hit_sphere(center: Point3, radius: number, r: Ray) {
    const oc = r.origin.subtract(center);
    const a = r.direction.squaredLength();
    const half_b = oc.dot(r.direction);
    const c = oc.squaredLength() - radius * radius;
    const discriminant = half_b * half_b - a * c;
    if (discriminant < 0) {
        return -1.0;
    } else {
        return (-half_b - Math.sqrt(discriminant)) / a;
    }
}

fs.writeFileSync("./output/test.ppm", imgData)

console.timeEnd("Total time")