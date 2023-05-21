import { Point3 } from "./Point3.js";
import { Ray } from "./Ray.js";
import { Vector3 } from "./Vector3.js";
import { Utils } from "./Utils.js"

export class Camera {
    private origin: Point3;
    private lower_left_corner: Point3;
    private horizontal: Vector3;
    private vertical: Vector3;
    private lens_radius:number;
    private w:Vector3;
    private u:Vector3;
    private v:Vector3;
    constructor(lookFrom: Point3, lookAt: Point3, vup: Vector3, vfov: number, aperture: number, focus_dist: number) {
        const aspect_ratio = 16.0 / 9.0;
        const theta = Utils.degreesToRadians(vfov);
        const h = Math.tan(theta / 2);
        const viewport_height = 2.0 * h;
        const viewport_width = aspect_ratio * viewport_height;
        // const image_width = 400;
        // const image_height = Math.floor(image_width / aspect_ratio);

        // const viewport_height = 2.0;
        // const viewport_width = aspect_ratio * viewport_height;
        this.w = lookFrom.subtract(lookAt).getNormalized();
        this.u = vup.cross(this.w).getNormalized();
        this.v = this.w.cross(this.u);


        this.origin = lookFrom;
        this.horizontal = this.u.multiply(viewport_width * focus_dist);
        this.vertical = this.v.multiply(viewport_height * focus_dist);
        this.lower_left_corner = this.origin.subtract(this.horizontal.divide(2))
            .subtract(this.vertical.divide(2)).subtract(this.w.multiply(focus_dist));
            
        this.lens_radius = aperture / 2;
    }

    getRay(iU, iV) {
        const rd = Vector3.randomInUnitSphere().multiply(this.lens_radius);
        const offset = this.u.multiply(rd.x).add(this.v.multiply(rd.y));

        var vectorHPos = this.horizontal.multiply(iU);
        var vectorVPos = this.vertical.multiply(iV);
        return new Ray(this.origin.add(offset), this.lower_left_corner.add(vectorHPos.add(vectorVPos)).subtract(this.origin).subtract(offset));
    }
}