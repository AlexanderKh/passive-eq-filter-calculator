<script setup>
import {useEQStore} from './eqStore'
import { onMounted, ref, defineProps, computed, watch } from 'vue'
import { FLStandardKnob } from 'precision-inputs'
import 'precision-inputs/dist/precision-inputs.css'

const props = defineProps(['position', 'filter'])
const eqStore = useEQStore()

const f0KnobRef = ref(null)
const qKnobRef = ref(null)
const dbKnobRef = ref(null)
let f0Knob = null
let qKnob = null
let dbKnob = null

const f0min = 10
const f0max = 40000
const f0MinLog = Math.log10(f0min)
const f0MaxLog = Math.log10(f0max)
const qMin = 0.1
const qMax = 10
const qMinLog = Math.log10(qMin)
const qMaxLog = Math.log10(qMax)
const dbMin = 0
const dbMax = 24

const f0Active = computed(() => {
  return props.filter.params.f0 != null
})
const qActive = computed(() => {
  return props.filter.params.q != null
})
const dbActive = computed(() => {
  return props.filter.params.db != null
})
const f0 = computed(() => {
  return props.filter.params.f0
})
const f0Log = computed(() => {
  return Math.log10(props.filter.params.f0)
})
const q = computed(() => {
  return props.filter.params.q
})
const qLog = computed(() => {
  return Math.log10(props.filter.params.q)
})
const db = computed(() => {
  return props.filter.params.db
})

function updateF0(newValue) {
  if (newValue && f0Active.value) {
    eqStore.setFilterParams(props.position, { f0: newValue })
  }
}
function updateQ(newValue) {
  if (newValue && qActive.value) {
    eqStore.setFilterParams(props.position, { q: newValue })
  }
}
function updateDB(newValue) {
  if (newValue && dbActive.value) {
    eqStore.setFilterParams(props.position, { db: newValue })
  }
}

onMounted(() => {
  if (f0Active.value) {
    f0Knob = new FLStandardKnob(f0KnobRef.value, {
      min: f0MinLog, max: f0MaxLog, initial: f0Log.value, color: 'aqua', dispatchEventOnSetterUse: false, wheelResistance: 200, dragResistance: 150
    })
    f0Knob.addEventListener('change', function(evt) {
      const newValue = Math.round(10 ** evt.target.value)
      updateF0(newValue)
    });
  }

  if (qActive.value) {
    qKnob = new FLStandardKnob(qKnobRef.value, {
      min: qMinLog, max: qMaxLog, initial: qLog.value, color: 'aqua', dispatchEventOnSetterUse: false
    })
    qKnob.addEventListener('change', function(evt) {
      const newValue = Number(10 ** evt.target.value).toFixed(3)
      updateQ(newValue)
    });
  }

  if (dbActive.value) {
    dbKnob = new FLStandardKnob(dbKnobRef.value, {
      min: dbMin, max: dbMax, step: 0.1, initial: db.value, color: 'aqua', dispatchEventOnSetterUse: false
    })
    dbKnob.addEventListener('change', function(evt) {
      updateDB(evt.target.value)
    });
  }
})

watch([f0Log, q, db], () => {
  if (f0Knob) {
    f0Knob.value = f0Log.value
  }
  if (qKnob) {
    qKnob.value = qLog.value
  }
  if (dbKnob) {
    dbKnob.value = db.value
  }
})

</script>

<template>
  <div class='controls-box'>
    <div class='control' v-if='f0Active'>
      <div class='control-label'>Frequency</div>
      <div class='control-knob' ref='f0KnobRef'></div>
      <input class='control-input' type='number' :value='f0' step='any' @input='evt => updateF0(evt.target.value)'>
    </div>
    <div class='control' v-if='qActive'>
      <div class='control-label'>Q</div>
      <div class='control-knob' ref='qKnobRef'></div>
      <input class='control-input' type='number' :value='q' step='any' @input='evt => updateQ(evt.target.value)'>
    </div>
    <div class='control' v-if='dbActive'>
      <div class='control-label'>DB</div>
      <div class='control-knob' ref='dbKnobRef'></div>
      <input class='control-input' type='number' :value='db' step='0.1' @input='evt => updateDB(evt.target.value)'>
    </div>
  </div>
</template>

<style scoped>
.controls-box {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-items: center;
  margin: 0 2px;
  padding-bottom: 12px;
}
.control-label {
  font-family: sans-serif;
  font-size: small;
  height: 25px;
  line-height: 25px;
  padding: 1px 0 0;
  user-select: none;
}
.control-knob {
  width: 60px;
  height: 60px;
}
.control-input {
  font-size: 12px;
  width: 50px;
  -moz-appearance: textfield;
  text-align: center;
  padding: 1px 0;
}
.control-input::-webkit-outer-spin-button,
.control-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.control {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
}
</style>