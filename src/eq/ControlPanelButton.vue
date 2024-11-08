<script setup>
defineProps(['onAction', 'iconSvg'])
</script>

<template>
  <div class='button-box' @click='onAction'>
    <component :is='iconSvg' class='button-icon'/>
    <div class='button-text'><slot/></div>
  </div>
</template>

<style scoped>
.button-box {
  height: min-content;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  user-select: none;
}
.button-box:hover {
  background-color: black;
  cursor: pointer;
}
.button-icon {
  width: 35px;
  height: 35px;
}
.button-box:hover .button-icon {
  color: white;
}
.button-text {
  margin-top: 4px;
  text-align: center;
}
.button-box:hover .button-text {
  color: white;
}
</style>