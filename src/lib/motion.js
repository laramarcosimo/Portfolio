// Lenguaje de movimiento único (espejo en CSS: --ease-expo, --dur-slow, --dur-quick en global.css).
// Curva larga expo-out, sin rebote ni muelle; solo transform y opacity, en distancias cortas.
export const EASE_EXPO = [0.16, 1, 0.3, 1]
export const EASE_SOFT = EASE_EXPO // alias: el resto de la web comparte la misma curva
export const DUR = { slow: 0.8, quick: 0.3 }
export const RISE = 16 // px que sube una aparición
