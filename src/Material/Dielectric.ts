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
        const refracted = Vector3.refract(unit_direction, record.normal, refraction_ratio);

        const scattered = new Ray(record.point, refracted);
        return{
            attenuation,
            scattered
        }
    }

}