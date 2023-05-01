import { Color } from "../Color.js";
import { HitRecord } from "../Hitable.js";
import { Material } from "./Material.js";
import { Ray } from "../Ray.js";
import { Vector3 } from "../Vector3.js";

export class Metal implements Material {
    public fuzz: number;
    constructor(public albedo: Color, fuzz: number) {
        this.fuzz = fuzz < 1 ? fuzz : 1;
    }

    scatter(rayIn: Ray, record: HitRecord): { scattered: Ray; attenuation: Color; } | undefined {
        const reflected = Vector3.reflect(rayIn.direction.getNormalized(), record.normal);
        let scattered;
        if(this.fuzz<1e-8){
            console.log("Test");
            scattered = new Ray(record.point, reflected);
        }
        else {
            scattered = new Ray(record.point, reflected.add(Vector3.randomInUnitSphere().multiply(this.fuzz)));
        }
        const attenuation = this.albedo;

        return scattered.direction.dot(record.normal) > 0 ? { scattered, attenuation } : undefined;
    }

}