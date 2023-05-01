import { Color } from "../Color.js";
import { HitRecord } from "../Hitable.js";
import { Ray } from "../Ray.js";
import { Vector3 } from "../Vector3.js";
import { Material } from "./Material.js";

export class Dielectric implements Material {
    constructor(public ir: number) {

    }
    scatter(rayIn: Ray, record: HitRecord): { scattered: Ray; attenuation: Color; } | undefined {
        const attenuation = new Color(1.0, 1.0, 1.0);
        const refraction_ratio = record.isFrontFace ? (1.0 / this.ir) : this.ir;

        const unit_direction = rayIn.direction.getNormalized();

        const cosTheta = Math.min(unit_direction.multiply(-1).dot(record.normal), 1.0);
        const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);

        const cannot_refract = refraction_ratio * sinTheta > 1.0;
        let direction: Vector3;

        if (cannot_refract|| Dielectric.reflectance(cosTheta, refraction_ratio) > Math.random())
            direction = Vector3.reflect(unit_direction, record.normal);
        else
            direction = Vector3.refract(unit_direction, record.normal, refraction_ratio);

        const scattered = new Ray(record.point, direction);

        return {
            attenuation,
            scattered
        }
    }

    static reflectance(cosine: number, ref_idx: number): number {
        // Use Schlick's approximation for reflectance.
        let r0 = (1 - ref_idx) / (1 + ref_idx);
        r0 = r0 * r0;
        return r0 + (1 - r0) * Math.pow((1 - cosine), 5);
    }

}