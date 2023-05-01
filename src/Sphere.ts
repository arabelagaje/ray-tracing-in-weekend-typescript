import { Hitable, HitRecord } from "./Hitable.js";
import { Material } from "./Material/Material.js";
import { Point3 } from "./Point3.js";
import { Ray } from "./Ray.js";

export class Sphere implements Hitable {
    constructor(public center: Point3, public radius: number, public material: Material) {
    }


    hit(ray: Ray, tMin: any, tMax: any): HitRecord {
        const oc = ray.origin.subtract(this.center);
        const a = ray.direction.squaredLength();
        const half_b = oc.dot(ray.direction);
        const c = oc.squaredLength() - this.radius * this.radius;

        const discriminant = half_b * half_b - a * c;
        if (discriminant < 0) return new HitRecord(false);
        const sqrtd = Math.sqrt(discriminant);

        // Find the nearest root that lies in the acceptable range.
        let root = (-half_b - sqrtd) / a;
        if (root < tMin || tMax < root) {
            root = (-half_b + sqrtd) / a;
            if (root < tMin || tMax < root)
                return new HitRecord(false);
        }

        const t = root;
        const point = ray.at(t);
        const out_normal = point.subtract(this.center).divide(this.radius);

        const hitRecord = new HitRecord(true, point, t, this.material);
        hitRecord.set_face_normal(ray, out_normal);

        return hitRecord;

    }
}