import { parentPort, workerData } from 'worker_threads'
import ESSerializer from 'esserializer';
import { Camera } from "./Camera.js";
import { Color } from "./Color.js";
import { Hitable } from "./Hitable.js";
import { Ray } from "./Ray.js";
import { Config } from './Config.js'
import { Vector3 } from "./Vector3.js";
import { Point3 } from "./Point3.js";
import { HitableList } from "./HitableList.js";
import { Sphere } from "./Sphere.js";
import { Dielectric } from "./Material/Dielectric.js";
import { Lambertian } from "./Material/Lambertian.js";
import { Metal } from "./Material/Metal.js";

ESSerializer.registerClasses([Camera, Vector3, Point3, Ray, HitableList, Sphere, Dielectric,Lambertian,Metal, Color])

export function rayColor(ray: Ray, world: Hitable, depth: number): Color {
    if (depth < 0) {
        return new Color(0, 0, 0);
    }
    const hitRecord = world.hit(ray, 0.001, Number.MAX_SAFE_INTEGER)
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

export function perPixel(i: number, j: number, camera: Camera, world: Hitable, image_width: number, image_height: number) {
    let pixel_color = new Color(0, 0, 0);
    for (let s = 0; s < Config.samplesPerPixel; s++) {
        const u = (i + Math.random()) / (image_width - 1);
        const v = (j + Math.random()) / (image_height - 1);
        const ray = camera.getRay(u, v);
        pixel_color.addTo(rayColor(ray, world, Config.maxDepth));
    }
    pixel_color.divideBy(Config.samplesPerPixel);
    pixel_color.r = Math.sqrt(pixel_color.r)
    pixel_color.g = Math.sqrt(pixel_color.g)
    pixel_color.b = Math.sqrt(pixel_color.b)
    pixel_color.multiplyBy(255.999);
    return pixel_color;
}

const camera = ESSerializer.deserialize(workerData.camera)
const world = ESSerializer.deserialize(workerData.world)
parentPort.on("message", (data)=>{
    let pixel_color = perPixel(data.i, data.j, camera, world, workerData.image_width, workerData.image_height)
    parentPort.postMessage(pixel_color);
})