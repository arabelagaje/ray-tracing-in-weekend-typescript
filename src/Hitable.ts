import { Material } from "./Material/Material.js";
import { Point3 } from "./Point3.js";
import { Ray } from "./Ray.js";
import { Vector3 } from "./Vector3.js";

export class HitRecord {
    public isFrontFace: boolean;
    public normal: Vector3;
    constructor(public isHit: boolean, public point: Point3 | undefined = undefined,
        public t: number | undefined = undefined, public material: Material | undefined = undefined) {

    }

    set_face_normal(ray: Ray, outward_normal: Vector3) {
        this.isFrontFace = ray.direction.dot(outward_normal) < 0;
        this.normal = this.isFrontFace ? outward_normal : outward_normal.multiply(-1);
    }
}


export interface Hitable {
    hit(ray: Ray, tMin, tMax): HitRecord;
}