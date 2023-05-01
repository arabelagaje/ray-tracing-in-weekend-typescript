import { Color } from "../Color.js";
import { HitRecord } from "../Hitable.js";
import { Material } from "./Material.js";
import { Ray } from "../Ray.js";
import { Vector3 } from "../Vector3.js";

export class Lambertian implements Material {
    constructor(public albedo: Color) {

    }

    scatter(rayIn: Ray, record: HitRecord): {
        scattered: Ray;
        attenuation: Color;
    } | undefined {

        let scatterDirection = record.normal.add(Vector3.randomInUnitSphere());
        if (scatterDirection.nearZero())
            scatterDirection = record.normal;

        const scattered = new Ray(record.point, scatterDirection);
        const attenuation = this.albedo;

        return {
            scattered,
            attenuation
        }
    }
}