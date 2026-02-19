<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  height: 100%;
  background: #0d0d0f;
}

body {
  font-family: 'DM Sans', sans-serif;
  color: #e8e8e0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0d0d0f;
}
::-webkit-scrollbar-thumb {
  background: #2a2a34;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3a3a44;
}
</style>
