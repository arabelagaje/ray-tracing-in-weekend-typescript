import { Point3 } from "./Point3.js";
import { Vector3 } from "./Vector3.js";

export class Ray {
    constructor(private _origin: Point3, private _direction: Vector3) {

    }

    get origin(): Point3 {
        return this._origin;
    }

    get direction(): Vector3 {
        return this.direction;
    }

    set origin(origin: Point3) {
        this._origin = origin;
    }

    set direction(direction: Vector3) {
        this.direction = direction;
    }

    at(t:number):Point3 {
       return this.origin.add(this.direction.multiply(t))
    }
}