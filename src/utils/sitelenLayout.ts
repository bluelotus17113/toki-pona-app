// Detección de compuestos sitelen pona por contención (estilo cartouche).
// Cada glifo en el lienzo tiene: { id, word, x, y, w, h }
// (x,y) = esquina sup-izq de su bounding box.

/** Un glifo colocado en el lienzo, con su caja envolvente. */
export interface Glyph {
  id: string
  word: string
  /** Borde izquierdo de la caja envolvente. */
  x: number
  /** Borde superior de la caja envolvente. */
  y: number
  w: number
  h: number
}

/** Caja envolvente sin identidad, tal como la devuelve `toBBox`. */
export type BBox = Pick<Glyph, 'x' | 'y' | 'w' | 'h'>

/** Mapa id → id del padre directo, o `null` si el glifo es de nivel superior. */
export type ParentMap = Record<string, string | null>

/** Un glifo raíz junto a los glifos que contiene, ya leídos en orden. */
export interface Compound {
  rootId: string
  childIds: string[]
  words: string[]
  /** Las palabras unidas por espacios: `"jan pona"`. */
  text: string
}

/** Lectura completa del lienzo. */
export interface Reading {
  compounds: Compound[]
  /** Todos los compuestos unidos por ` · `. */
  allText: string
}

/**
 * Subconjunto de la API de un nodo Konva que necesita `toBBox`.
 * Se declara aquí en vez de importar el tipo de Konva para que este módulo
 * siga siendo independiente de la librería de dibujo.
 */
export interface MeasurableNode {
  x(): number
  y(): number
  width(): number
  height(): number
  scaleX(): number
  scaleY(): number
}

// ¿Está A "dentro" de B? Heurística: el centro de A debe caer dentro de B,
// y A debe ser notablemente más chico que B (área < 60% de B).
function isInside(a: Glyph, b: Glyph): boolean {
  if (a.id === b.id) return false
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const inside = ax >= b.x && ax <= b.x + b.w && ay >= b.y && ay <= b.y + b.h
  if (!inside) return false
  const aArea = a.w * a.h
  const bArea = b.w * b.h
  return aArea < bArea * 0.6
}

// Para cada glifo encuentra su "container" más chico (el padre directo).
// Devuelve mapa id → parentId (o null si no tiene padre).
function buildParentMap(glyphs: Glyph[]): ParentMap {
  const parents: ParentMap = {}
  for (const a of glyphs) {
    let bestParent: string | null = null
    let bestArea = Infinity
    for (const b of glyphs) {
      if (isInside(a, b)) {
        const area = b.w * b.h
        if (area < bestArea) {
          bestArea = area
          bestParent = b.id
        }
      }
    }
    parents[a.id] = bestParent
  }
  return parents
}

// Ordena glifos por posición visual: top→bottom, left→right.
// Tolera diferencia vertical pequeña como "misma fila".
function sortByPosition(glyphs: Glyph[], rowTolerance = 30): Glyph[] {
  return [...glyphs].sort((a, b) => {
    const ayCenter = a.y + a.h / 2
    const byCenter = b.y + b.h / 2
    if (Math.abs(ayCenter - byCenter) > rowTolerance) {
      return ayCenter - byCenter
    }
    return a.x - b.x
  })
}

/**
 * Computa la lectura completa del lienzo.
 * Devuelve los compuestos ordenados visualmente y su texto concatenado.
 */
export function computeReading(glyphs: Glyph[] | null | undefined): Reading {
  if (!glyphs || glyphs.length === 0) {
    return { compounds: [], allText: '' }
  }

  const parents = buildParentMap(glyphs)

  // glifos top-level (sin padre)
  const roots = glyphs.filter(g => parents[g.id] === null)

  // hijos por padre
  const childrenOf: Record<string, Glyph[]> = {}
  for (const g of glyphs) {
    const p = parents[g.id]
    if (p !== null) {
      if (!childrenOf[p]) childrenOf[p] = []
      childrenOf[p].push(g)
    }
  }

  // Construir compuestos: para cada root → palabras = root + hijos ordenados
  const compounds: Compound[] = sortByPosition(roots).map(root => {
    const children = childrenOf[root.id]
      ? sortByPosition(childrenOf[root.id])
      : []
    const words = [root.word, ...children.map(c => c.word)]
    return {
      rootId: root.id,
      childIds: children.map(c => c.id),
      words,
      text: words.join(' ')
    }
  })

  const allText = compounds.map(c => c.text).join(' · ')
  return { compounds, allText }
}

/**
 * Dado un nodo de Konva ya medido, genera un bbox normalizado para el algoritmo.
 * Se ignora la rotación: se asume que las cajas están alineadas a los ejes.
 */
export function toBBox(node: MeasurableNode): BBox {
  const w = node.width() * node.scaleX()
  const h = node.height() * node.scaleY()
  return {
    x: node.x(),
    y: node.y(),
    w,
    h
  }
}
