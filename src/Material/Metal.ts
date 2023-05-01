import { Color } from "../Color.js";
import { HitRecord } from "../Hitable.js";
import { Material } from "./Material.js";
import { Ray } from "../Ray.js";
import { Vector3 } from "../Vector3.js";

export class Metal implements Material {
    constructor(public albedo: Color) {

    }

    scatter(rayIn: Ray, record: HitRecord): { scattered: Ray; attenuation: Color; } | undefined {
        const reflected = Vector3.reflect(rayIn.direction.getNormalized(), record.normal);
        const scattered = new Ray(record.point, reflected);
        const attenuation = this.albedo;

        return scattered.direction.dot(record.normal) > 0 ? { scattered, attenuation } : undefined;
    }

}