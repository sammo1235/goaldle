<template>
  <div class="header">
    <div style="flex-direction: row; display: flex; margin-right: auto; margin-left: auto;">
      <h3 style="margin-left: auto; cursor: pointer;">Stats</h3>
      <h3 style="margin-right: auto; margin-left: 2rem; cursor: pointer;" @click="showHowTo()">How To Play</h3>
    </div>
  </div>
  <div v-if="showHowToPlay" class="modal" style="">
    <p style="font-size: 20px">Guess the Mystery Player!</p>
    <p>You have 7 guesses to find the mystery player of the day.</p>
    <p>If you get any of the players' attributes correct, the corresponding box will show as green.</p>
    <p>If you get close to, but not quite the correct attribute, the box will show as orange. For example:</p>
    <p>Age within 2 years</p>
    <p>Nationality in the right continent but wrong country</p>
    <p>One of the two Kit colours correct</p>
    <p>Good Luck!</p>
    <button @click="showHowTo()" style="padding-inline: 2rem; background: #fff">Close</button>
  </div>
  <div :class="[showHowToPlay ? 'modal-backdrop' : null, 'hello']">
    <Game :show-how-to-play="this.showHowToPlay" />
  </div>
    <div class="footer">
  </div>
</template>

<script>
import Game from './components/Game.vue'
export default {
  name: 'App',
  components: {
    Game
  },
  data() {
    return {
      showHowToPlay: false
    }
  },
  created() {
    document.title = "Goaldle"
  },
  methods: {
    showHowTo() {
      this.showHowToPlay = !this.showHowToPlay
    }
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
.modal-backdrop {
  opacity: 0.5 !important;
}
.modal {
  z-index: 50;
  padding: 4rem;
  border-radius: 25px;
  position: absolute; 
  left: 0;
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  width: 480px; /* Need a specific value to work */
  margin-bottom: 5rem;
  top: 15rem; 
  border: 1px solid lightblue; 
  background: #fff
}
.header {
  width: 100%;
  background: #3AAFA9;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #3AAFA9;
  height: 4rem;
}
body {
  margin: 0;
}
</style>
