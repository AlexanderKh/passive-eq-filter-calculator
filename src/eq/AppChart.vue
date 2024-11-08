<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useDark } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useEQStore } from './eqStore'

const eqStore = useEQStore()
const { measurement, frequencyLimits, minVisibleDB, maxVisibleDB } = storeToRefs(eqStore)

const canvasRef = ref(null)
const canvasWrapperRef = ref(null)
let canvas2DContext = null
let cursorPosX = null
let cursorPosY = null

let backgroundColor = null
const DARK_ACCENT_COLOR = '#000000'
const WHITE_ACCENT_COLOR = '#ffffff'

const isDarkRef = useDark()

watch([measurement, frequencyLimits.value, minVisibleDB, maxVisibleDB], () => {
  drawChart()
})

watch([isDarkRef], () => {
  nextTick(() => {
    updateBackgroundColor()
    drawChart()
  })
})

const DEFAULT_FONT_SIZE = 13
const DEFAULT_SIDE_SCALE_SIZE = 48

const minVisibleDeg = -180
const maxVisibleDeg = 180
const degLabelsAt = [maxVisibleDeg, maxVisibleDeg / 2, 0, minVisibleDeg / 2, minVisibleDeg]

const topScaleSize = 30
const bottomScaleSize = 24
let rightScaleSize = DEFAULT_SIDE_SCALE_SIZE
let leftScaleSize = DEFAULT_SIDE_SCALE_SIZE

let fontSize = DEFAULT_FONT_SIZE
let verticalFontOffset = fontSize / 4

function buildGridGradient(ctx, width, height, isDark) {
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, isDark ? DARK_ACCENT_COLOR : WHITE_ACCENT_COLOR);
  grad.addColorStop(0.15, isDark ? WHITE_ACCENT_COLOR : DARK_ACCENT_COLOR);
  grad.addColorStop(0.85, isDark ? WHITE_ACCENT_COLOR : DARK_ACCENT_COLOR);
  grad.addColorStop(1, isDark ? DARK_ACCENT_COLOR : WHITE_ACCENT_COLOR);

  return grad;
}

function drawChart() {
  if (!canvas2DContext) {
    return
  }

  const isDark = isDarkRef.value
  const ctx = canvas2DContext
  const canvasWidth = ctx.canvas.width
  const canvasHeight = ctx.canvas.height
  const minVisibleF = Math.floor(frequencyLimits.value.start)
  const maxVisibleF = Math.ceil(frequencyLimits.value.end)
  const minVisibleDb = parseFloat(minVisibleDB.value)
  const maxVisibleDb = parseFloat(maxVisibleDB.value)
  const minVisibleFlog = Math.log10(minVisibleF)
  const maxVisibleFlog = Math.log10(maxVisibleF)
  const lineAreaWidth = canvasWidth - (leftScaleSize + rightScaleSize)
  const lineAreaHeight = canvasHeight - (bottomScaleSize + topScaleSize)
  const xFlogInPx = (maxVisibleFlog - minVisibleFlog) / lineAreaWidth
  const yDbInPx = (maxVisibleDb - minVisibleDb) / lineAreaHeight
  const yDegInPx = (maxVisibleDeg - minVisibleDeg) / lineAreaHeight

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.font = `${fontSize}px monospace`

  // X Grid And Labels Creation
  const xGridThickPath = new Path2D()
  const xGridThinPath = new Path2D()
  const xGridLabels = []
  for (let i = minVisibleF; i <= maxVisibleF;) {
    const xGridIteratorLog = Math.log10(i)
    const currentBasePower = Math.floor(xGridIteratorLog)
    const currentBase = 10 ** currentBasePower
    const xLinePos = (xGridIteratorLog - minVisibleFlog) / xFlogInPx + leftScaleSize
    const firstDigit = i / currentBase
    const iteratorAtEdges = i === minVisibleF || i === maxVisibleF
    const iteratorAtBase = i % currentBase === 0

    if (!iteratorAtEdges && iteratorAtBase) {
      const path = firstDigit === 1 ? xGridThickPath : xGridThinPath
      path.moveTo(xLinePos, topScaleSize)
      path.lineTo(xLinePos, canvasHeight - bottomScaleSize)
    }

    if ([1, 2, 5].includes(firstDigit) || iteratorAtEdges) {
      const fText = Math.round(i).toString()
      const fTextPosY = canvasHeight - bottomScaleSize + fontSize + 3
      xGridLabels.push([fText, xLinePos, fTextPosY])
    }

    i += iteratorAtBase ? currentBase : 1
  }
  // X Grid And Labels Creation End

  // Y Magnitude Grid And Labels Creation
  const yMagGridThinPath = new Path2D()
  const yMagGridThickPath = new Path2D()
  const yMagGridLabels = []
  for (let i = minVisibleDb; i <= maxVisibleDb; i += 0.1) {
    i = parseFloat(i.toFixed(1)) // Round to first decimal
    // We only draw anything at whole db numbers
    if (i % 1 !== 0) {
      continue
    }

    const yLinePos = (i - minVisibleDb) / yDbInPx + bottomScaleSize
    const canvasyLinePos = canvasHeight - yLinePos

    if (i !== minVisibleDb && i !== maxVisibleDb) {
      const path = i % 3 === 0 ? yMagGridThickPath : yMagGridThinPath
      path.moveTo(leftScaleSize, canvasyLinePos)
      path.lineTo(canvasWidth - rightScaleSize, canvasyLinePos)
    }

    if (i % 3 === 0) {
      const dbText = i.toFixed(1).toString()
      const dbTextPosX = canvasWidth - 5
      const dbTextPosY = canvasyLinePos + verticalFontOffset
      yMagGridLabels.push([dbText, dbTextPosX, dbTextPosY])
    }
  }
  // Y Magnitude Grid And Labels Creation End

  // Y Phase Labels Creation
  const yPhGridLabels = []
  degLabelsAt.forEach((yPhIterator) => {
    const yLinePos = (yPhIterator - minVisibleDeg) / yDegInPx + bottomScaleSize
    const canvasyLinePos = canvasHeight - yLinePos

    const degText = Math.round(yPhIterator).toString()
    const degTextPosX = leftScaleSize - 5
    const degTextPosY = canvasyLinePos + verticalFontOffset
    yPhGridLabels.push([degText, degTextPosX, degTextPosY])
  })
  // Y Phase Labels Creation End

  // Line Paths Creation
  const magLinePath = new Path2D()
  const phaseLinePath = new Path2D()
  for (let i = 0; i < measurement.value.length; i++) {
    const currFLog = Math.log10(measurement.value[i].f)
    const currDb = measurement.value[i].db
    const currDeg = measurement.value[i].deg

    const pointX = (currFLog - minVisibleFlog) / xFlogInPx + leftScaleSize
    const pointYMag = (currDb - minVisibleDb) / yDbInPx + bottomScaleSize
    const canvasPointYMag = canvasHeight - pointYMag
    const pointYPh = (currDeg - minVisibleDeg) / yDegInPx + bottomScaleSize
    const canvasPointYPh = canvasHeight - pointYPh

    if (i === 0) {
      magLinePath.moveTo(pointX, canvasPointYMag)
      phaseLinePath.moveTo(pointX, canvasPointYPh)
    } else {
      magLinePath.lineTo(pointX, canvasPointYMag);
      phaseLinePath.lineTo(pointX, canvasPointYPh);
    }
  }
  // Line Paths Creation End

  // Fill Paths Creation
  const magFillPath = new Path2D(magLinePath);
  const zeroYMag = (-minVisibleDb) / yDbInPx + bottomScaleSize
  const canvasZeroYMag = canvasHeight - zeroYMag
  magFillPath.lineTo(canvasWidth - rightScaleSize, canvasZeroYMag)
  magFillPath.lineTo(leftScaleSize, canvasZeroYMag)
  magFillPath.closePath()

  const phFillPath = new Path2D(phaseLinePath);
  const zeroYPh = (-minVisibleDeg) / yDegInPx + bottomScaleSize
  const canvasZeroYPh = canvasHeight - zeroYPh
  phFillPath.lineTo(canvasWidth - rightScaleSize, canvasZeroYPh)
  phFillPath.lineTo(leftScaleSize, canvasZeroYPh)
  phFillPath.closePath()
  // Fill Paths Creation End

  // Beautification Gradients
  const horGridGradient = buildGridGradient(ctx, 0, canvasHeight, isDark);
  const verGridGradient = buildGridGradient(ctx, canvasWidth, 0, isDark);

  // Draw background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Draw Everything in Correct Order
  ctx.lineWidth = 0.25;
  ctx.strokeStyle = horGridGradient
  ctx.stroke(xGridThinPath)
  ctx.strokeStyle = verGridGradient
  ctx.stroke(yMagGridThinPath)
  ctx.lineWidth = 0.75;
  ctx.strokeStyle = horGridGradient
  ctx.stroke(xGridThickPath)
  ctx.strokeStyle = verGridGradient
  ctx.stroke(yMagGridThickPath)
  ctx.lineWidth = 3;

  ctx.strokeStyle = isDark ? 'rgb(244,135,135)' : 'rgb(246,13,13)'
  ctx.fillStyle = isDark ? 'rgba(244,135,135,0.1)' : 'rgba(246,13,13,0.1)'
  ctx.fill(magFillPath)
  ctx.stroke(magLinePath)
  ctx.lineWidth = 2;
  ctx.strokeStyle = isDark ? 'rgb(144,182,244)' : 'rgb(13,106,246)'
  ctx.fillStyle = isDark ? 'rgba(144,182,244,0.2)' : 'rgba(13,106,246,0.2)'
  // ctx.fill(phFillPath)
  ctx.stroke(phaseLinePath)

  // Clean after line paths that can go over chart space
  ctx.fillStyle = backgroundColor
  ctx.lineWidth = 0;
  ctx.fillRect(0, 0, canvasWidth, topScaleSize) // Top scale
  ctx.fillRect(0, 0, leftScaleSize, canvasHeight) // Left scale
  ctx.fillRect(canvasWidth - rightScaleSize, 0, rightScaleSize, canvasHeight) // Right scale
  ctx.fillRect(0, canvasHeight - bottomScaleSize, canvasWidth, bottomScaleSize) // Bottom scale

  // Draw actual chart box
  ctx.strokeStyle = isDark ? WHITE_ACCENT_COLOR : DARK_ACCENT_COLOR
  ctx.lineWidth = 0.5;
  ctx.strokeRect(leftScaleSize, topScaleSize, canvasWidth - rightScaleSize - leftScaleSize, canvasHeight - bottomScaleSize - topScaleSize)

  // Draw Grid labels
  ctx.fillStyle = isDark ? WHITE_ACCENT_COLOR : DARK_ACCENT_COLOR;
  ctx.textAlign = 'center'
  xGridLabels.forEach((xGridLabelArgs) => ctx.fillText(...xGridLabelArgs))
  ctx.textAlign = 'right'
  yMagGridLabels.forEach((yGridLabelArgs) => ctx.fillText(...yGridLabelArgs))
  yPhGridLabels.forEach((yGridLabelArgs) => ctx.fillText(...yGridLabelArgs))

  // Draw Axis Labels
  ctx.textAlign = 'center'
  ctx.fillText('Phase°', leftScaleSize / 2, fontSize)
  ctx.fillText('DB', canvasWidth - rightScaleSize / 2, fontSize)

  // Draw Cursor
  const cursorXInChartArea = cursorPosX != null && cursorPosX > leftScaleSize && cursorPosX < (canvasWidth - rightScaleSize)
  const cursorYInChartArea = cursorPosY != null && cursorPosY > topScaleSize && cursorPosY < (canvasHeight - bottomScaleSize)
  const cursorInChartArea = cursorXInChartArea && cursorYInChartArea
  if (cursorInChartArea) {
    // Draw Crosshair
    ctx.lineWidth = 0.75;
    ctx.strokeStyle = isDark ? WHITE_ACCENT_COLOR : DARK_ACCENT_COLOR
    ctx.beginPath();
    ctx.moveTo(leftScaleSize, cursorPosY);
    ctx.lineTo(canvasWidth - rightScaleSize, cursorPosY);
    ctx.moveTo(cursorPosX, topScaleSize);
    ctx.lineTo(cursorPosX, canvasHeight - bottomScaleSize);
    ctx.stroke();

    // Compute Label Values
    const currentDb = (Math.abs(cursorPosY - canvasHeight) - bottomScaleSize) * yDbInPx + minVisibleDb
    const currentDegRef = (Math.abs(cursorPosY - canvasHeight) - bottomScaleSize) * yDegInPx + minVisibleDeg
    const currentFLogRef = (cursorPosX - leftScaleSize) * xFlogInPx + minVisibleFlog
    const currentFRef = 10 ** currentFLogRef

    // Format Label Values
    const dbText = currentDb.toFixed(1).toString()
    const degText = Math.round(currentDegRef).toString()
    const fText = Math.round(currentFRef).toString()

    // Compute Label Text Positions
    const horTextPosX = cursorPosX
    const horTextPosY = canvasHeight - bottomScaleSize + fontSize + 3
    const dbTextPosX = canvasWidth - 5
    const degTextPosX = leftScaleSize - 5
    const verTextPosY = cursorPosY + verticalFontOffset

    // Compute Label Boxes Positions
    const halfHorBoxSizeX = fText.length * 5 + 3
    const horTextRectPosX = cursorPosX - halfHorBoxSizeX
    const horTextRectPosY = canvasHeight - bottomScaleSize + 3
    const horTextRectSizeX = halfHorBoxSizeX * 2
    const horTextRectSizeY = DEFAULT_FONT_SIZE + 4
    const dbTextRectPosX = canvasWidth - rightScaleSize + 2
    const dbTextRectSizeX = rightScaleSize - 4
    const degTextRectPosX = 2
    const degTextRectSizeX = leftScaleSize - 4
    const verTextRectPosY = cursorPosY - fontSize / 2 - 3
    const verTextRectSizeY = fontSize + 3

    // Draw Label Boxes
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'white'
    ctx.lineWidth = 0.5
    ctx.fillRect(dbTextRectPosX, verTextRectPosY, dbTextRectSizeX, verTextRectSizeY)
    ctx.fillRect(degTextRectPosX, verTextRectPosY, degTextRectSizeX, verTextRectSizeY)
    ctx.fillRect(horTextRectPosX, horTextRectPosY, horTextRectSizeX, horTextRectSizeY)
    ctx.fillStyle = 'rgba(246,13,13,0.2)'
    ctx.fillRect(dbTextRectPosX, verTextRectPosY, dbTextRectSizeX, verTextRectSizeY)
    ctx.fillStyle = 'rgba(13,106,246,0.2)'
    ctx.fillRect(degTextRectPosX, verTextRectPosY, degTextRectSizeX, verTextRectSizeY)
    ctx.strokeRect(dbTextRectPosX, verTextRectPosY, dbTextRectSizeX, verTextRectSizeY)
    ctx.strokeRect(degTextRectPosX, verTextRectPosY, degTextRectSizeX, verTextRectSizeY)
    ctx.strokeRect(horTextRectPosX, horTextRectPosY, horTextRectSizeX, horTextRectSizeY)

    // Draw Label Texts
    ctx.fillStyle = 'black'
    ctx.textAlign = 'right'
    ctx.fillText(dbText, dbTextPosX, verTextPosY)
    ctx.fillText(degText, degTextPosX, verTextPosY)
    ctx.textAlign = 'center'
    ctx.fillText(fText, horTextPosX, horTextPosY)
  }
  // Draw Cursor End
}

onMounted(() => {
  updateBackgroundColor()

  window.addEventListener('resize', recalculateSize);

  canvas2DContext = canvasRef.value.getContext('2d')
  canvas2DContext.imageSmoothingEnabled = false

  recalculateSize()

  drawChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', recalculateSize);
})

function updateBackgroundColor() {
  backgroundColor = getComputedStyle(document.body).getPropertyValue('--section-background-color')
}

function mouseMovedInCanvas(event) {
  if (!canvasRef.value) {
    return false
  }

  const cRect = canvasRef.value.getBoundingClientRect();
  cursorPosX = Math.round(event.clientX - cRect.left);
  cursorPosY = Math.round(event.clientY - cRect.top);

  drawChart()
}

function mouseLeftCanvas() {
  cursorPosX = null
  cursorPosY = null

  drawChart()
}

function recalculateSize() {
  if (!canvasRef.value || !canvasWrapperRef.value) {
    return false
  }
  const boxHeight = canvasWrapperRef.value.offsetHeight
  const boxWidth = canvasWrapperRef.value.offsetWidth

  canvasRef.value.height = boxHeight - 4
  canvasRef.value.width = boxWidth - 4

  if (boxWidth < 600) {
    if (boxWidth < 530) {
      fontSize = 10
      leftScaleSize = 40
      rightScaleSize = 40
    } else {
      fontSize = 12
      leftScaleSize = DEFAULT_SIDE_SCALE_SIZE
      rightScaleSize = DEFAULT_SIDE_SCALE_SIZE
    }
  } else {
    fontSize = DEFAULT_FONT_SIZE
    leftScaleSize = DEFAULT_SIDE_SCALE_SIZE
    rightScaleSize = DEFAULT_SIDE_SCALE_SIZE
  }

  verticalFontOffset = fontSize / 4


  drawChart()
}

function saveChart() {
  if (!canvasRef.value || !canvasWrapperRef.value) {
    return false
  }

  const canvasURL = canvasRef.value.toDataURL()
  const saveChartLink = document.createElement('a');
  saveChartLink.href = canvasURL;
  saveChartLink.download = "Response Chart";
  saveChartLink.click();
  saveChartLink.remove();
}

defineExpose({ saveChart })
</script>


<template>
  <div class='canvas-wrapper' ref='canvasWrapperRef'>
    <canvas
      id='eq-canvas'
      ref='canvasRef'
      @mousemove='mouseMovedInCanvas'
      @mouseleave='mouseLeftCanvas'
    />
  </div>
</template>


<style scoped>
.canvas-wrapper {
  background-color: var(--section-background-color);
  border: 2px solid var(--border-color);
  border-radius: var(--section-border-radius);
  object-fit: contain;
  position: relative;
  aspect-ratio: 2 / 1;
}
#eq-canvas {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>