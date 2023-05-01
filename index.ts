import * as fs from 'fs';
import { Ray } from './src/Ray.js';
import { Vector3 } from './src/Vector3.js';
import { Color } from './src/Color.js';
import { Point3 } from './src/Point3.js';
import { Hitable } from './src/Hitable.js';
import { HitableList } from './src/HitableList.js';
import { Sphere } from './src/Sphere.js';
import { Camera } from './src/Camera.js';
import { Lambertian } from './src/Material/Lambertian.js';
import { Metal } from './src/Material/Metal.js';
import { Dielectric } from './src/Material/Dielectric.js';

console.time("Total time")

const R = Math.cos(Math.PI/4);

const camera = new Camera(90);

const aspect_ratio = 16.0 / 9.0;
const image_width = 400;
const image_height = Math.floor(image_width / aspect_ratio);
const maxDepth = 50;

const samplesPerPixel = 100;

const world = new HitableList();

let ground = new Sphere(new Point3(0, -100.5, -1), 100, new Lambertian(new Color(0.8, 0.8, 0.0)));
let left = new Sphere(new Point3(-R, 0, -1), R, new Lambertian(new Color(0,0,1)));
let center = new Sphere(new Point3(0, 0, -1), 0.5,new Dielectric(1.5));
let right = new Sphere(new Point3(R, 0, -1), R, new Lambertian(new Color(1,0,0)));

// world.add(ground);
world.add(left);
// world.add(center);
world.add(right);

// Render
let imgData = "P3\n" + image_width + " " + image_height + "\n255\n";

for (let j = image_height - 1; j >= 0; --j) {
    console.log("Scanlines remaining: ", j)
    for (let i = 0; i < image_width; ++i) {
        let pixel_color = new Color(0, 0, 0);
        for (let s = 0; s < samplesPerPixel; s++) {
            const u = (i + Math.random()) / (image_width - 1);
            const v = (j + Math.random()) / (image_height - 1);
            const ray = camera.getRay(u, v);
            pixel_color.addTo(rayColor(ray, world, maxDepth));
        }
        pixel_color.divideBy(samplesPerPixel);
        pixel_color.r = Math.sqrt(pixel_color.r)
        pixel_color.g = Math.sqrt(pixel_color.g)
        pixel_color.b = Math.sqrt(pixel_color.b)
        pixel_color.multiplyBy(255.999);
        imgData += Math.floor(pixel_color.r) + ' ' + Math.floor(pixel_color.g) + ' ' + Math.floor(pixel_color.b) + "\n";
    }
}

function rayColor(ray: Ray, world: Hitable, depth: number): Color {
    if (depth < 0) {
        return new Color(0, 0, 0);
    }
    const hitRecord = world.hit(ray, 0, Number.MAX_SAFE_INTEGER)
    if (hitRecord.isHit) {
        let record = hitRecord.material.scatter(ray, hitRecord)
        if (record) {
            const attenuation = record.attenuation;
            const color = rayColor(record.scattered, world, depth - 1);
            return new Color(attenuation.r * color.r, attenuation.g * color.g, attenuation.b * color.b);
        }
        return new Color(0, 0, 0);
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