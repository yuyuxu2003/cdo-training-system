<template>
  <div class="app-wrapper">
    <router-view />
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #e8e8e8; }
.app-wrapper { max-width: 480px; margin: 0 auto; min-height: 100vh; background: #f5f5f5; position: relative; overflow-x: hidden; }
</style>
