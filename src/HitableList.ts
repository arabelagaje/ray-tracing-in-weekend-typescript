import { Hitable, HitRecord } from "./Hitable.js";
import { Ray } from "./Ray";

export class HitableList implements Hitable {
    objects: Array<Hitable> = [];

    hit(ray: Ray, tMin: any, tMax: any): HitRecord {
        let hit_anything: HitRecord = new HitRecord(false, undefined, tMax);

        for (let i = 0; i < this.objects.length; i++) {
            const object = this.objects[i]
            const currentHit = object.hit(ray, tMin, hit_anything.t)
            if (currentHit.isHit) {
                hit_anything = currentHit;
            }
        }
        return hit_anything;
    }

    add(object: Hitable) {
        this.objects.push(object);
    }

    clear() {
        this.objects = [];
    }

} 