import { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Text, Transformer } from 'react-konva'
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { playClick } from '../hooks/useSound.js'
import { computeReading } from '../utils/sitelenLayout.js'

const DEFAULT_SIZE = 80
const DEFAULT_FILL = '#1b2099'
const COLOR_PRESETS = ['#1b2099', '#e85d75', '#2d9a48', '#fbc02d', '#000000', '#ff6b35', '#8338ec']

const COMMON = ['mi','sina','ona','jan','pona','ike','telo','moku','tomo','kasi','suli','lili']

let _idCounter = 1
const nextId = () => `g${_idCounter++}_${Date.now().toString(36)}`

export default function SitelenLienzo({ lang = 'es', onExit }) {
  const t = makeT(lang)
  const stageRef = useRef(null)
  const trRef = useRef(null)
  const containerRef = useRef(null)

  const [glyphs, setGlyphs] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [stageSize, setStageSize] = useState({ w: 320, h: 360 })
  const [paletteOpen, setPaletteOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [saveStatus, setSaveStatus] = useState(null)
  const [fontReady, setFontReady] = useState(false)

  // medir el contenedor del canvas para que sea responsive
  useEffect(() => {
    const measure = () => {
      const el = containerRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setStageSize({ w: Math.max(280, r.width), h: Math.max(300, r.height) })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [paletteOpen])

  // asegurar que la fuente esté cargada antes de pintar en canvas
  useEffect(() => {
    if (!document.fonts) { setFontReady(true); return }
    document.fonts.load(`80px "linja pona"`)
      .then(() => setFontReady(true))
      .catch(() => setFontReady(true))
  }, [])

  // attach transformer al glifo seleccionado
  useEffect(() => {
    if (!trRef.current || !stageRef.current) return
    if (selectedId) {
      const node = stageRef.current.findOne('#' + selectedId)
      if (node) {
        trRef.current.nodes([node])
        trRef.current.getLayer().batchDraw()
      }
    } else {
      trRef.current.nodes([])
      trRef.current.getLayer().batchDraw()
    }
  }, [selectedId, glyphs])

  // recomputar lectura cuando cambian los glifos
  const reading = useMemo(() => {
    const items = glyphs.map(g => ({
      id: g.id,
      word: g.word,
      x: g.x,
      y: g.y,
      w: g.fontSize * g.scaleX,   // glifos sitelen pona son aprox. cuadrados
      h: g.fontSize * g.scaleY
    }))
    return computeReading(items)
  }, [glyphs])

  const palette = useMemo(() => {
    const all = Object.values(VOCAB).map(v => v.tp).sort((a, b) => a.localeCompare(b))
    const q = search.trim().toLowerCase()
    if (!q) return all
    return all.filter(w => w.toLowerCase().startsWith(q) ||
      (VOCAB[w]?.[lang] ?? VOCAB[w]?.es ?? '').toLowerCase().includes(q))
  }, [search, lang])

  // ============ acciones ============

  const addGlyph = (word) => {
    playClick()
    const cx = stageSize.w / 2
    const cy = stageSize.h / 2
    const newGlyph = {
      id: nextId(),
      word,
      x: cx - DEFAULT_SIZE / 2 + (Math.random() * 40 - 20),
      y: cy - DEFAULT_SIZE / 2 + (Math.random() * 40 - 20),
      fontSize: DEFAULT_SIZE,
      fill: DEFAULT_FILL,
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    }
    setGlyphs(prev => [...prev, newGlyph])
    setSelectedId(newGlyph.id)
  }

  const updateGlyph = (id, patch) => {
    setGlyphs(prev => prev.map(g => g.id === id ? { ...g, ...patch } : g))
  }

  const handleDragEnd = (id, e) => {
    updateGlyph(id, { x: e.target.x(), y: e.target.y() })
  }

  const handleTransformEnd = (id, e) => {
    const node = e.target
    updateGlyph(id, {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation()
    })
  }

  const deleteSelected = () => {
    if (!selectedId) return
    playClick()
    setGlyphs(prev => prev.filter(g => g.id !== selectedId))
    setSelectedId(null)
  }

  const changeColor = (color) => {
    if (!selectedId) return
    updateGlyph(selectedId, { fill: color })
  }

  const clearAll = () => {
    if (glyphs.length === 0) return
    if (!confirm(t('confirmClearCanvas'))) return
    playClick()
    setGlyphs([])
    setSelectedId(null)
  }

  const handleStageClick = (e) => {
    // click en el fondo → deseleccionar
    if (e.target === e.target.getStage()) setSelectedId(null)
    else if (e.target.attrs._isBg) setSelectedId(null)
  }

  const handleSave = async () => {
    if (glyphs.length === 0) {
      setSaveStatus({ kind: 'error', msg: t('canvasEmpty') })
      setTimeout(() => setSaveStatus(null), 2500)
      return
    }
    playClick()
    // desactivar transformer para que no aparezca en la imagen
    const prev = selectedId
    setSelectedId(null)
    await new Promise(r => setTimeout(r, 100)) // dejar re-renderizar
    const uri = stageRef.current.toDataURL({ pixelRatio: 2, mimeType: 'image/png' })
    setSelectedId(prev)

    const fileName = `sitelen-${Date.now()}.png`
    if (Capacitor.isNativePlatform()) {
      try {
        const base64 = uri.split(',')[1]
        await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: Directory.Documents
        })
        setSaveStatus({ kind: 'ok', msg: t('savedTo', { path: `Documents/${fileName}` }) })
      } catch (err) {
        setSaveStatus({ kind: 'error', msg: t('saveFailed') + ': ' + (err?.message ?? err) })
      }
    } else {
      const a = document.createElement('a')
      a.href = uri
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      setSaveStatus({ kind: 'ok', msg: t('savedTo', { path: fileName }) })
    }
    setTimeout(() => setSaveStatus(null), 3500)
  }

  return (
    <div className="lienzo-screen">
      <header className="lesson-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="lienzo-header-title">
          <h2>🖼️ {t('iloSitelenTitle')}</h2>
        </div>
        <div className="lienzo-header-actions">
          <button className="lienzo-icon-btn" onClick={handleSave} title={t('save')}>💾</button>
          <button className="lienzo-icon-btn danger" onClick={clearAll} title={t('clear')}>🗑️</button>
        </div>
      </header>

      <div className="lienzo-reading">
        {reading.allText ? (
          <span>{reading.allText}</span>
        ) : (
          <span className="lienzo-reading-empty">{t('iloSitelenHint')}</span>
        )}
      </div>

      {saveStatus && (
        <div className={`lienzo-toast ${saveStatus.kind}`}>{saveStatus.msg}</div>
      )}

      <div className="lienzo-canvas-wrap" ref={containerRef}>
        {fontReady && (
          <Stage
            ref={stageRef}
            width={stageSize.w}
            height={stageSize.h}
            onMouseDown={handleStageClick}
            onTouchStart={handleStageClick}
          >
            <Layer>
              {/* fondo blanco — actúa como "lienzo" */}
              <Rect
                _isBg
                x={0}
                y={0}
                width={stageSize.w}
                height={stageSize.h}
                fill="#ffffff"
                listening={true}
                onClick={() => setSelectedId(null)}
                onTap={() => setSelectedId(null)}
              />
              {glyphs.map(g => (
                <Text
                  key={g.id}
                  id={g.id}
                  x={g.x}
                  y={g.y}
                  text={g.word}
                  fontFamily="linja pona"
                  fontSize={g.fontSize}
                  fill={g.fill}
                  scaleX={g.scaleX}
                  scaleY={g.scaleY}
                  rotation={g.rotation}
                  draggable
                  onClick={() => setSelectedId(g.id)}
                  onTap={() => setSelectedId(g.id)}
                  onDragStart={() => setSelectedId(g.id)}
                  onDragEnd={(e) => handleDragEnd(g.id, e)}
                  onTransformEnd={(e) => handleTransformEnd(g.id, e)}
                />
              ))}
              <Transformer
                ref={trRef}
                rotateEnabled={true}
                enabledAnchors={['top-left','top-right','bottom-left','bottom-right']}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 20 || newBox.height < 20) return oldBox
                  return newBox
                }}
              />
            </Layer>
          </Stage>
        )}
        {!fontReady && (
          <div className="lienzo-loading">{t('fontLoading')}</div>
        )}
      </div>

      {selectedId && (
        <div className="lienzo-toolbar">
          <div className="lienzo-toolbar-section">
            <span className="lienzo-toolbar-label">{t('color')}</span>
            <div className="lienzo-color-row">
              {COLOR_PRESETS.map(c => (
                <button
                  key={c}
                  className="lienzo-color-chip"
                  style={{ background: c }}
                  onClick={() => changeColor(c)}
                  aria-label={`color ${c}`}
                />
              ))}
              <input
                type="color"
                className="lienzo-color-picker"
                value={glyphs.find(g => g.id === selectedId)?.fill ?? DEFAULT_FILL}
                onChange={(e) => changeColor(e.target.value)}
              />
            </div>
          </div>
          <button className="lienzo-icon-btn danger" onClick={deleteSelected} title={t('delete')}>
            🗑️
          </button>
        </div>
      )}

      <div className="lienzo-palette-toggle">
        <button onClick={() => setPaletteOpen(o => !o)} className="lienzo-palette-btn">
          {paletteOpen ? `↓ ${t('hidePalette')}` : `↑ ${t('showPalette')}`}
        </button>
      </div>

      {paletteOpen && (
        <div className="lienzo-palette">
          <div className="lienzo-palette-search">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {!search && (
            <div className="lienzo-common">
              {COMMON.map(w => (
                <button
                  key={w}
                  className="sitelen-key common"
                  onClick={() => addGlyph(w)}
                  title={VOCAB[w]?.[lang] ?? VOCAB[w]?.es}
                >
                  <span className="sitelen sitelen-key-glyph">{w}</span>
                  <span className="sitelen-key-latin">{w}</span>
                </button>
              ))}
            </div>
          )}

          <div className="lienzo-palette-grid">
            {palette.map(w => (
              <button
                key={w}
                className="sitelen-key"
                onClick={() => addGlyph(w)}
                title={VOCAB[w]?.[lang] ?? VOCAB[w]?.es}
              >
                <span className="sitelen sitelen-key-glyph">{w}</span>
                <span className="sitelen-key-latin">{w}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
