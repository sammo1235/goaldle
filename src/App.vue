<template>
  <div class="header">
    <div style="flex-direction: row; display: flex; margin-right: auto; margin-left: auto;">
      <h3 style="margin-left: auto; cursor: pointer;" @click="showStatsModal()">Stats</h3>
      <h3 style="margin-right: auto; margin-left: 2rem; cursor: pointer;" @click="showHowTo()">How To Play</h3>
    </div>
  </div>

  <div v-if="showHowToPlay" class="modal">
    <p style="font-size: 25px">Guess the Mystery Premier League Player!</p>
    <p>You have 7 guesses to find the mystery outfield (no goalkeepers!) player of the day.</p>
    <p><span style="color: #37be75">GREEN:</span> If you get any of the players' attributes correct, the corresponding box will show as green.</p>
    <p><span style="color: #ffa64d">ORANGE:</span> If you get close to, but not quite the correct attribute, the box will show as orange. For example:</p>
    <p style="margin: 4px;">- Age within 2 years</p>
    <p style="margin: 4px;">- Nationality in the right continent but wrong country</p>
    <p style="margin: 4px;">- One of the two Kit colours matches e.g. Claret & Blue is a partial match with Blue</p>
    <p><span style="color: #878a8c">GREY:</span> If the attribute is completely wrong, then you’ll get greyed out.</p>
    <p>Good Luck!</p>
    <button @click="showHowTo()" class="button-43" role="button">Close</button>
  </div>

  <div v-if="showStats" class="modal">
    <p style="font-size: 35px;">Statistics</p>
    <div style="display: flex; justifyContent: space-evenly;">
      <div style="display: flex; flex-direction: column">
        <p style="font-size: 30px; margin: 0px;">{{ totalGamesPlayed }}</p>
        <p>Played</p>
      </div>
      <div style="display: flex; flex-direction: column">
        <p style="font-size: 30px; margin: 0px;">{{ totalGamesWon }}</p>
        <p>Won</p>
      </div>
      <div style="display: flex; flex-direction: column">
        <p style="font-size: 30px; margin: 0px;">{{ winRatePercentage }}%</p>
        <p>Win Rate</p>
      </div>
    </div>
    <p>Guess Distribution:</p>
    <div style="display: flex; flex-direction: column-reverse; justifyContent: space-evenly; margin: 0px; align-items: flex-start; padding-inline: 1rem;">
      <div style="display: flex; width: 100%">
        <p style="margin: 5px">7</p><p class="progress-bar" :style="{'width': guessedInPercentage(7)}"><span style="margin-right: 4px;">{{ guessedIn(7) }}</span></p>
      </div>
      <div style="display: flex; width: 100%">
        <p style="margin: 5px">6</p><p class="progress-bar" :style="{'width': guessedInPercentage(6)}"><span style="margin-right: 4px;">{{ guessedIn(6) }}</span></p>
      </div>
      <div style="display: flex; width: 100%">
        <p style="margin: 5px">5</p><p class="progress-bar" :style="{'width': guessedInPercentage(5)}"><span style="margin-right: 4px;">{{ guessedIn(5) }}</span></p>
      </div>
      <div style="display: flex; width: 100%">
        <p style="margin: 5px">4</p><p class="progress-bar" :style="{'width': guessedInPercentage(4)}"><span style="margin-right: 4px;">{{ guessedIn(4) }}</span></p>
      </div>
      <div style="display: flex; width: 100%">
        <p style="margin: 5px">3</p><p class="progress-bar" :style="{'width': guessedInPercentage(3)}"><span style="margin-right: 4px;">{{ guessedIn(3) }}</span></p>
      </div>
      <div style="display: flex; width: 100%">
        <p style="margin: 5px">2</p><p class="progress-bar" :style="{'width': guessedInPercentage(2)}"><span style="margin-right: 4px;">{{ guessedIn(2) }}</span></p>
      </div>
      <div style="display: flex; width: 100%">
        <p style="margin: 5px; margin-right: 8px;">1</p><p class="progress-bar" :style="{'width': guessedInPercentage(1)}"><span style="margin-right: 4px;">{{ guessedIn(1) }}</span></p>
      </div>
    </div>
    <button @click="showStatsModal()" class="button-43" role="button">Close</button>
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
    if(!this.$store.getters.hasSeenTutorial) {
      this.showHowToPlay = true
      this.$store.commit('seenTutorial')
    }
    // Title
    document.title = "Goaldle"
    // Google analytics
    let Script = document.createElement("script");
    Script.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=G-M4DVV9YY7B");
    let Script2 = document.createElement("script");
    Script2.innerHTML = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-M4DVV9YY7B');"
    document.head.appendChild(Script);
    document.head.appendChild(Script2);
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
      if (Object.keys(results).length == 0) {
        return 0
      } else {
        return Math.round((Object.keys(results).filter((key) => results[key].won).length / Object.keys(results).length) * 100)
      }
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
    },
    guessedInPercentage(turnsTaken) {
      let results = this.$store.getters.getResultsHistory
      if (this.totalGamesWon2() > 0) {
        let wonInTurnsTaken = Object.keys(results).filter((key) => results[key].turns_taken == turnsTaken).length
        if (wonInTurnsTaken == 0) {
          return "5%"
        } else {
          let guessedInPerc = Object.keys(results).filter((key) => results[key].turns_taken == turnsTaken).length / this.totalGamesWon2()
          if (guessedInPerc < 0.05) {
            return "5%"
          } else {
            return `${guessedInPerc * 100}%`
          }
        }
      } else {
        return "5%"
      }
    },
    totalGamesWon2() {
      let results = this.$store.getters.getResultsHistory
      return Object.keys(results).filter((key) => results[key].won).length
    },
  }
}
</script>

<style>
@font-face {
  font-family: "Radikal";
  src: local("Radikal"),
    url(./fonts/nootype_radikal_medium.otf) format("truetype")
}
#app {
  font-family: "Radikal";
  src: local("Radikal"),
    url(./fonts/nootype_radikal_medium.otf) format("truetype");

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.modal-backdrop {
  opacity: 0.5 !important;
}
.modal {
  display: flex;
  flex-direction: column;
  z-index: 50;
  padding: 3rem;
  border-radius: 25px;
  position: absolute; 
  left: 0;
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  min-width: 240px;
  max-width: 480px; /* Need a specific value to work */
  margin-bottom: 5rem;
  top: 6rem; 
  border: 1px solid lightblue; 
  background: #fff;
  box-shadow: 5px 10px;
}
.header {
  width: 100%;
  background: #3AAFA9;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #3AAFA9;
}
@media only screen and (min-width: 600px) {
  .footer {
    margin-top: 2rem;
    height: 4rem;
  }
}
body {
  margin: 0;
}
.progress-bar {
  font-size: 14px;
  display: inline-block; 
  margin: 3px; 
  padding: 0.2rem; 
  background: #878a8c; 
  color: #fff;
  text-align: right
}
/* CSS */
.button-43 {
  background-image: linear-gradient(-180deg, #37AEE2 0%, #1E96C8 100%);
  border-radius: .5rem;
  box-sizing: border-box;
  color: #FFFFFF;
  display: flex;
  font-size: 16px;
  margin-top: 1rem;
  margin-right: auto;
  margin-left: auto;
  justify-self: center;
  justify-content: center;
  padding: 1rem 1.75rem;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-43:hover {
  background-image: linear-gradient(-180deg, #1D95C9 0%, #17759C 100%);
}

@media (min-width: 768px) {
  .button-43 {
    padding: 1rem 2rem;
  }
}
</style>
