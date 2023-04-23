export class Utils {
    static degreesToRadians(degrees: number) {
        return degrees * Math.PI / 180.0;
    }

    static clamp(x: number, min: number, max: number) {
        if (x < min) return min;
        if (x > max) return max;
        return x;
    }
}