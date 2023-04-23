import { Vector3 } from "./Vector3.js";

export class Color extends Vector3 {
    get r(): number {
        return this.x;
    }

    get g(): number {
        return this.y;
    }

    get b(): number {
        return this.z;
    }
    set r(r: number) {
        this.x = r;
    }

    set g(g: number) {
        this.y = g;
    }

    set b(b: number) {
        this.z = b;
    }

    static fromVector3(vector3: Vector3): Color {
        return new Color(vector3.x, vector3.y, vector3.z);
    }
}