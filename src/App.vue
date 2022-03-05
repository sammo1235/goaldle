<template>
  <div class="header">
    <div style="flex-direction: row; display: flex; margin-right: auto; margin-left: auto;">
      <h3 style="margin-left: auto; cursor: pointer;" @click="showStatsModal()">Stats</h3>
      <h3 style="margin-right: auto; margin-left: 2rem; cursor: pointer;" @click="showHowTo()">How To Play</h3>
    </div>
  </div>

  <div v-if="showHowToPlay" class="modal">
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

  <div v-if="showStats" class="modal">
    <p style="font-size: 20px;">Statistics</p>
    <div style="display: flex; justifyContent: space-evenly;">
      <span>Played: {{ totalGamesPlayed }}</span>
      <span>Won: {{ totalGamesWon }}</span>
      <span>Win Rate {{ winRatePercentage }}%</span>
    </div>
    <p>Guess Distribution:</p>
    <div style="display: flex; justifyContent: space-evenly;">
      <p>7: {{ guessedIn(7) }}</p>
      <p>6: {{ guessedIn(6) }}</p>
      <p>5: {{ guessedIn(5) }}</p>
      <p>4: {{ guessedIn(4) }}</p>
      <p>3: {{ guessedIn(3) }}</p>
      <p>2: {{ guessedIn(2) }}</p>
      <p>1: {{ guessedIn(1) }}</p>
    </div>
    <button @click="showStatsModal()" style="padding-inline: 2rem; background: #fff">Close</button>
  </div>

  <div :class="[showHowToPlay || showStats ? 'modal-backdrop' : null, 'hello']">
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
      showHowToPlay: false,
      showStats: false
    }
  },
  created() {
    document.title = "Goaldle"
  },
  computed: {
    totalGamesPlayed() {
      return Object.keys(this.$store.getters.getResultsHistory).length;
    },
    totalGamesWon() {
      let results = this.$store.getters.getResultsHistory
      return Object.keys(results).filter((key) => results[key].won).length
    },
    winRatePercentage() {
      let results = this.$store.getters.getResultsHistory
      return (Object.keys(results).filter((key) => results[key].won).length / Object.keys(results).length) * 100
    }
  },
  methods: {
    showHowTo() {
      this.showStats = false
      this.showHowToPlay = !this.showHowToPlay
    },
    showStatsModal() {
      this.showHowToPlay = false
      this.showStats = !this.showStats
    },
    guessedIn(turnsTaken) {
      let results = this.$store.getters.getResultsHistory   
      return Object.keys(results).filter((key) => results[key].turns_taken == turnsTaken).length
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
  min-width: 240px;
  max-width: 480px; /* Need a specific value to work */
  margin-bottom: 5rem;
  top: 15rem; 
  border: 1px solid lightblue; 
  background: #fff;
  box-shadow: 5px 10px;
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
