<template>
  <div class="header">
  </div>
  <Game />
    <div class="footer">
  </div>
</template>

<script>
import Game from './components/Game.vue'
export default {
  name: 'App',
  components: {
    Game
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.header {
  width: 100%;
  background: #3AAFA9;
  padding: 2rem;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #3AAFA9;
  padding: 2rem;
}
body {
  margin: 0
}
</style>
