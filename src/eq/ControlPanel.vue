<script setup>
import { VueToggles } from "vue-toggles";
import SaveIcon from '../assets/control-panel-icons/infrastructure-ui-save.svg'
import UploadIcon from '../assets/control-panel-icons/infrastructure-ui-upload.svg'
import ClearIcon from '../assets/control-panel-icons/infrastructure-ui-discussion-x.svg'
import TrashIcon from '../assets/control-panel-icons/infrastructure-ui-trash.svg'
import ControlPanelButton from './ControlPanelButton.vue'
import { useEQStore } from './eqStore'
import { useDark, useToggle } from '@vueuse/core'
import Papa from 'papaparse'

const MEGABYTE = 1048576

const isDarkRef = useDark()
const toggleDark = useToggle(isDarkRef)

const eqStore = useEQStore()

function frequencyLimitSet(event, field) {
  if (!event.target.value) {
    return false;
  }
  const newValue = parseFloat(event.target.value)
  if (newValue > 0) {
    eqStore.frequencyLimits[field] = newValue
  }
}

function removeAllFilters() {
  if (window.confirm("Really remove all filters?")) {
    eqStore.removeAllFilters()
  }
}

function loadInitialResponse() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  input.accept = 'text/csv, text/plain';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return false
    }
    if (file.size > MEGABYTE) {
      return false
    }
    const frequencies = []
    const measures = []
    const phases = []
    Papa.parse(file, {
      comments: '*',
      header: false,
      delimitersToGuess: [' ', '\t', ','],
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (row, parser) => {
        if (row.errors.length > 0) {
          console.error(row.errors)
          return parser.abort()
        }

        const data = row.data;
        if (data.length < 2) {
          console.error('Bad CSV')
          return parser.abort()
        }

        const frequency = data[0]
        const measure = data[1]
        const phase = data.length > 2 ? data[2] : null

        const badFrequency = typeof frequency !== 'number' || frequency < 0
        const badMeasure = typeof measure !== 'number'
        const badPhase = phase !== null && typeof phase !== 'number'
        if (badFrequency || badMeasure || badPhase) {
          console.error('Bad CSV')
          return parser.abort()
        }

        frequencies.push(frequency)
        measures.push(measure)
        phases.push(phase)
      },
      complete: () => {
        eqStore.setInitialResponse({ frequencies, measures, phases })
      },
      error: (error) => {
        console.error(error)
      }
    });
  };

  input.click();
}

</script>

<template>
  <div class='app-control-box'>
    <ControlPanelButton :iconSvg='TrashIcon' :onAction='removeAllFilters'>
      Remove All Filters
    </ControlPanelButton>

    <ControlPanelButton :iconSvg='SaveIcon' :onAction='() => $emit("saveChart")'>Save Chart</ControlPanelButton>
    <ControlPanelButton :iconSvg='SaveIcon' :onAction='() => $emit("saveScheme")'>Save Scheme</ControlPanelButton>

    <div class='column-box'>
      <div>Measurement Window</div>
      <div>
        From
        <input class='number-input' type='number' min='1' :max='eqStore.frequencyLimits.end' step='1' :value='eqStore.frequencyLimits.start' @input='event => frequencyLimitSet(event, "start")'/>
        to
        <input class='number-input' type='number' min='eqStore.frequencyLimits.start' step='1' :value='eqStore.frequencyLimits.end' @input='event => frequencyLimitSet(event, "end")'/>
        HZ
      </div>
    </div>
    <div class='column-box'>
      <div>Chart DB Limits</div>
      <div>
        From
        <input class='number-input-small' type='number' :max='eqStore.maxVisibleDB - 1' step='1' v-model.number='eqStore.minVisibleDB'/>
        to
        <input class='number-input-small' type='number' :min='eqStore.minVisibleDB + 1' step='1' v-model.number='eqStore.maxVisibleDB'/>
        DB
      </div>
    </div>
    <div class='column-box'>
      <div>Color Mode</div>
      <VueToggles
          :value="isDarkRef"
          @click="toggleDark"
          width='65'
          height='30'
          checkedText='🌙'
          checkedTextColor='blue'
          checkedBg='rgba(255,255,255,0.2)'
          uncheckedText='🔆'
          uncheckedTextColor='#fac736'
          uncheckedBg='rgba(0,0,0,0.4)'
          fontSize='20'
          fontWeight='lighter'
      />
    </div>

    <ControlPanelButton :iconSvg='UploadIcon' :onAction='loadInitialResponse'>
      Load Initial Response
      <br/>
      .txt or .csv from REW
      <br/>
      1Mb max
    </ControlPanelButton>
    <ControlPanelButton v-if='eqStore.initialResponsePresent' :iconSvg='ClearIcon' :onAction='eqStore.clearInitialResponse'>
      Clear Initial Response
    </ControlPanelButton>
    <div v-if='eqStore.initialResponsePresent' class='column-box'>
      <div>Toggle Initial Response</div>
      <VueToggles
          :value="eqStore.initialResponseVisible"
          @click="eqStore.setInitialResponseVisible(!eqStore.initialResponseVisible)"
          width='65'
          height='30'
          checkedText='✔️'
          checkedBg='rgba(0, 128, 128,0.4)'
          uncheckedText='❌'
          uncheckedBg='rgba(0,0,0,0.4)'
          fontSize='20'
      />
    </div>
  </div>
</template>

<style scoped>
.app-control-box {
  padding: 5px;
  background-color: var(--section-background-color);
  border: 2px solid var(--border-color);
  border-radius: var(--section-border-radius);
  gap: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  user-select: none;
}
.column-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 8px;
  height: min-content;
}
.number-input {
  width: 65px;
}
.number-input-small {
  width: 50px;
}
</style>