import { Color } from "../Color.js";
import { HitRecord } from "../Hitable.js";
import { Ray } from "../Ray.js";

export interface Material {
    scatter(rayIn: Ray, record: HitRecord): {
        scattered: Ray;
        attenuation: Color;
    } | undefined;
}