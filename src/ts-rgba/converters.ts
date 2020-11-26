import { RGB, RGBA, HSL, HSLA, HSV, HSVA, HEX } from './types';

// RGBA255 <-> HEX
export function rgba255ToHex(rgba: RGBA): HEX {
    return rgba.r.toString(16) + rgba.g.toString(16) + rgba.b.toString(16) + rgba.a.toString(16)
}
export function hexToRgba255(hex: HEX): RGBA {
    if (hex.startsWith('#')) hex = hex.substring(1)

    while (hex.length < 8) {
        var _hex = ''

        if (hex.length == 3 || hex.length == 4) {
            for (const c of hex) {
                _hex += c.repeat(2)
            }
        } else { _hex = hex }

        if (_hex.length == 6) _hex += 'ff'

        hex = _hex
    }

    const intVal = parseInt(hex, 16)

    return {
        r: intVal >> 24 & 255,
        g: intVal >> 16 & 255,
        b: intVal >> 8 & 255,
        a: intVal >> 0 & 255
    }
}

// RGBA255 <-> INT
export function rgba255ToInt(rgba255: RGBA): number {
    return rgba255.r * 16777216 +    // Math.pow(256, 3)
           rgba255.g * 65536 +       // Math.pow(256, 2)
           rgba255.b * 256 +         // Math.pow(256, 1)
           rgba255.a                 // Math.pow(256, 0)
}
export function intToRgba255(int: number): RGBA {
    return {
        r: int >> 24 & 255,
        g: int >> 16 & 255,
        b: int >> 8 & 255,
        a: int >> 0 & 255
    }
}

// RGBA255 <-> HSVA
export function rgba255ToHsva(rgba255: RGBA): HSVA {
    const rgba1 = rgba255ToRgba1(rgba255)
    const v = Math.max(rgba1.r, rgba1.g, rgba1.b)
    const n = v - Math.min(rgba1.r, rgba1.g, rgba1.b)

    const h = n && ((v == rgba1.r) ? (rgba1.g - rgba1.b)/n : ((v == rgba1.g) ? 2 + (rgba1.b - rgba1.r) / n : 4 + (rgba1.r - rgba1.g) / n))

    return {
        h: Math.round(60 * (h < 0 ? h + 6 : h)),
        s: v && n / v,
        v: v,
        a: Math.round(rgba1.a * 255)
    }
}
export function hsvaToRgba255(hsva: HSVA): RGBA {
    let f = (n: number, k = (n + hsva.h / 60) % 6) => hsva.v - hsva.v * hsva.s * Math.max(Math.min(k, 4 - k, 1), 0)

    return rgba1ToRgba255({
        r: f(5),
        g: f(3),
        b: f(1),
        a: Math.round(hsva.a / 255)
    })
}

export function hslaToRgba255(hsla: HSLA): RGBA {
    const a = hsla.s * Math.min(hsla.l, 1 - hsla.l)
    const f = (n: number, k = (n + hsla.h / 30) % 12) => hsla.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

    return rgba1ToRgba255({
        r: f(0),
        g: f(8),
        b: f(4),
        a: hsla.a / 255
    })
}
export function rgba255ToHsla(rgba255: RGBA): HSLA {
    const rgba1 = rgba255ToRgba1(rgba255)

    const a = Math.max(rgba1.r, rgba1.g, rgba1.b)
    const n = a - Math.min(rgba1.r, rgba1.g, rgba1.b)
    const f = (1 - Math.abs(a + a - n - 1))
    const h = n && ((a == rgba1.r) ? (rgba1.g - rgba1.b) / n : ((a == rgba1.g) ? 2 + (rgba1.b - rgba1.r) / n : 4 + (rgba1.r - rgba1.g) / n))

    return {
        h: 60 * (h < 0 ? h + 6 : h),
        s: f ? n / f : 0,
        l: (a + a - n) / 2,
        a: rgba255.a
    }
}

// RGBA255 <-> RGBA1
export function rgba255ToRgba1(rgba255: RGBA): RGBA {
    return {
        r: rgba255.r/255,
        g: rgba255.g/255,
        b: rgba255.b/255,
        a: rgba255.a/255
    }
}
export function rgba1ToRgba255(rgba1: RGBA): RGBA {
    return {
        r: Math.round(rgba1.r*255),
        g: Math.round(rgba1.g*255),
        b: Math.round(rgba1.b*255),
        a: Math.round(rgba1.a*255)
    }
}

// RGBA <-> RGB
export function rgb255ToRgba255(rgb255: RGB, a: number): RGBA { return { r: rgb255.r, g: rgb255.g, b: rgb255.b, a: a ?? 255 } }
export function rgbaToRgb(rgba255: RGBA): RGB { return { r: rgba255.r, g: rgba255.g, b: rgba255.b } }
export function rgb1ToRgba1(rgb1: RGB, a: number): RGBA { return rgb255ToRgba255(rgb1, a ?? 1) }

// HSVA <-> HSV
export function hsvaToHsv(hsva: HSVA): HSV { return { h: hsva.h, s: hsva.s, v: hsva.v } }
export function hsvToHsva(hsv: HSV, a: number): HSVA { return { h: hsv.h, s: hsv.s, v: hsv.v, a: a ?? 255 } }

// HSLA <-> HSL
export function hslaToHsl(hsla: HSLA): HSL { return { h: hsla.h, s: hsla.s, l: hsla.l } }
export function hslToHsla(hsl: HSL, a: number): HSLA { return { h: hsl.h, s: hsl.s, l: hsl.l, a: a ?? 255 } }