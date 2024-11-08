<script setup>
</script>

<template>
  <div class='footer'>
    <span class='footer-text'>Made by <a class='link' href='https://github.com/AlexanderKh' target='_blank'>AlexanderKh</a></span>
    <span class='footer-text'><a class='link' href='./README.md' target='_blank'>Readme</a></span>
    <span class='footer-text'><a class='link' href='./LICENSE.md' target='_blank'>License</a></span>
    <span class='footer-text'><a class='link' href='./THIRD-PARTY-LICENSES.txt' target='_blank'>Open Source Licenses</a></span>
  </div>
</template>

<style scoped>
.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  user-select: none;
}
.footer-text {
  border: 2px solid var(--border-color);
  padding: 1px 3px;
}
.link {
  color: var(--accent-color);
  text-decoration: underline;
}
.link:hover {
  opacity: 0.8;
}
</style>