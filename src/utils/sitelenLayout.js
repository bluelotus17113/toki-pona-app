// Detección de compuestos sitelen pona por contención (estilo cartouche).
// Cada glifo en el lienzo tiene: { id, word, x, y, w, h }
// (x,y) = esquina sup-izq de su bounding box.

// ¿Está A "dentro" de B? Heurística: el centro de A debe caer dentro de B,
// y A debe ser notablemente más chico que B (área < 60% de B).
function isInside(a, b) {
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
function buildParentMap(glyphs) {
  const parents = {}
  for (const a of glyphs) {
    let bestParent = null
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
function sortByPosition(glyphs, rowTolerance = 30) {
  return [...glyphs].sort((a, b) => {
    const ayCenter = a.y + a.h / 2
    const byCenter = b.y + b.h / 2
    if (Math.abs(ayCenter - byCenter) > rowTolerance) {
      return ayCenter - byCenter
    }
    return a.x - b.x
  })
}

// Computa la lectura completa del lienzo.
// Devuelve: { compounds: [ {root, children, text}, ... ], allText: 'jan pona | telo' }
export function computeReading(glyphs) {
  if (!glyphs || glyphs.length === 0) {
    return { compounds: [], allText: '' }
  }

  const parents = buildParentMap(glyphs)
  const byId = Object.fromEntries(glyphs.map(g => [g.id, g]))

  // glifos top-level (sin padre)
  const roots = glyphs.filter(g => parents[g.id] === null)

  // hijos por padre
  const childrenOf = {}
  for (const g of glyphs) {
    const p = parents[g.id]
    if (p !== null) {
      if (!childrenOf[p]) childrenOf[p] = []
      childrenOf[p].push(g)
    }
  }

  // Construir compuestos: para cada root → palabras = root + hijos ordenados
  const compounds = sortByPosition(roots).map(root => {
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

// Helper: dado un glifo seleccionado y sus medidas reales en Konva,
// genera un bbox normalizado para el algoritmo.
export function toBBox(node) {
  // node es un nodo Konva Text con x, y, width, height, scaleX, scaleY, rotation
  // Para simplicidad ignoramos rotación (asumimos axis-aligned)
  const w = node.width() * node.scaleX()
  const h = node.height() * node.scaleY()
  return {
    x: node.x(),
    y: node.y(),
    w,
    h
  }
}
