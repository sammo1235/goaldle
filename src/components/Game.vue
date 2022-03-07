<template>
  <div v-if="showWon" class="modal">
    <p style="font-size: 35px">Well done!</p>
    <p>You guessed the mystery player in {{ 7 - this.turnsLeft }} {{ (7 - this.turnsLeft) > 1 ? 'turns' : 'turn' }}.</p>
    <p>{{ this.mysteryPlayer.full_name }}</p>
    <div id="gameResults" class="mini-wrapper" style="row-gap: 20px;" v-for="guess in guesses" v-bind:key="guess.id">
      <div :class="[clubCorrect(guess.current_club) ? 'correct' : 'incorrect', 'cell cell-border cell-border-top']"></div>
      <div :class="[positionCorrect(guess.position) ? 'correct' : 'incorrect', 'cell cell-border cell-border-top']"></div>
      <div :class="[countryCorrect(guess.nationality) ? 'correct' : continentCorrect(guess.continent) ? 'close' : 'incorrect', 'cell cell-border cell-border-top']"></div>
      <div :class="[ageCorrect(guess.age) ? 'correct' : ageClose(guess.age) ? 'close' : 'incorrect', 'cell cell-border cell-border-top']"></div>
      <div :class="[colourCorrect(guess.kit_colour) ? 'correct' : colourHalfCorrect(guess.kit_colour) ? 'close' : 'incorrect', 'cell cell-border-top']"></div>
    </div>

    <button @click="closeShowWon()" class="button-43" role="button">Close</button>
  </div>

  <div v-if="showLost" class="modal">
    <p style="font-size: 20px">Better luck next time!</p>
    <p>The mystery players name was:</p>
    <p>{{ this.mysteryPlayer.full_name }}</p>
    <button @click="closeShowLost()" class="button-43" role="button">Close</button>
  </div>

  <div :class="[showWon || showLost ? 'modal-backdrop' : null, 'hello']">
    <h1>Goaldle</h1>

    <div class="search">
      <input type="text" class="search-input" v-model="search" placeholder="Search Players" :disabled="gameFinished || showWon || showLost || showHowToPlay" />
      <ul style="display: flex; flex-direction: column; border: 1px solid lightblue">
        <li class="search-result" v-for="player in filteredPlayers" v-bind:key="player.id" @click="guessPlayer(player.full_name)">{{ player.full_name}}</li>
      </ul>
    </div>

    <div style="margin-top: 7rem; margin-bottom: 8rem;">
      <div :class="[this.turnsLeft > 6 ? 'hide' : 'wrapper']" style="row-gap: 20px;">
        <div class="title-cell"></div>
        <div class="title-cell">Club</div>
        <div class="title-cell">Position</div>
        <div class="title-cell">Nationality</div>
        <div class="title-cell">Age</div>
        <div class="title-cell">Kit Colour</div>
      </div>
      <div class="wrapper" style="row-gap: 20px;" v-for="guess in guesses" v-bind:key="guess.id">
        <div class="cell cell-border name cell-border-top">{{ guess.full_name }}</div>
        <div :class="[clubCorrect(guess.current_club) ? 'correct' : 'incorrect', 'cell cell-border cell-border-top']">{{ guess.current_club }}</div>
        <div :class="[positionCorrect(guess.position) ? 'correct' : 'incorrect', 'cell cell-border cell-border-top']">{{ guess.position }}</div>
        <div :class="[countryCorrect(guess.nationality) ? 'correct' : continentCorrect(guess.continent) ? 'close' : 'incorrect', 'cell cell-border cell-border-top']">{{ guess.nationality }}</div>
        <div :class="[ageCorrect(guess.age) ? 'correct' : ageClose(guess.age) ? 'close' : 'incorrect', 'cell cell-border cell-border-top']">{{ guess.age }}</div>
        <div :class="[colourCorrect(guess.kit_colour) ? 'correct' : colourHalfCorrect(guess.kit_colour) ? 'close' : 'incorrect', 'cell cell-border-top']">{{ guess.kit_colour }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import csvFile from "../assets/goaldle.csv"
// import ClipboardItem from 'clipboard'

export default {
  name: 'PlayGame',
  props: {
    msg: String,
    showHowToPlay: Boolean
  },
  data() {
    return {
      search: '',
      turnsLeft: 7,
      mysteryPlayer: csvFile[47],
      playerDatabase: null,
      guesses: [],
      showInstructions: false,
      showWon: false,
      showLost: false,
      gameFinished: false
    }
  },
  created() {
    this.playerDatabase = csvFile.filter(function (pl) {
      if (pl.position != "Goalkeeper") {
        return pl
      }
    })
    // new player per hour
    const ms_per_hour = 1 * 60 * 60 * 1000
    let hours_since_epoch = Math.floor((new Date()).getTime() / ms_per_hour)
    let player_index = hours_since_epoch % this.playerDatabase.length
    this.mysteryPlayer = this.playerDatabase[player_index]
    console.log("mysteryPlayer: ", this.mysteryPlayer.full_name, this.mysteryPlayer.current_club, this.mysteryPlayer.position, this.mysteryPlayer.nationality, this.mysteryPlayer.age, this.mysteryPlayer.kit_colour)
    // fill current day guesses if present
    let guesses = this.$store.getters.getGuesses
    if (guesses) {
      guesses.forEach(guess => {
        this.guesses.push(guess)
        this.turnsLeft -= 1
      })
    }
    // show hours result if already played
    let results = this.$store.getters.getResultsHistoryForTimePeriod
    if (results != null) {
      if (results.won) {
        this.showWon = true;
      } else {
        this.showLost = true
      }
      this.gameFinished = true
    } 
  },
  computed: {
    filteredPlayers() {
      if (this.search == "") {
        return []
      }
      let players = this.playerDatabase.filter(player => {
        return player.full_name.toLowerCase().includes(this.search.toLowerCase())
      })
      return players.slice(0, 5)
    }
  },
  methods: {
    guessPlayer(guessedName) {
      let player = this.playerDatabase.find(player => 
        player.full_name.toLowerCase() == guessedName.toLowerCase()
      )
      this.guesses.push(player)
      this.$store.commit('addGuess', player)
      this.search = ''
      this.turnsLeft -= 1
      if (player == this.mysteryPlayer) {
        this.showWon = true
        this.gameFinished = true
        this.$store.commit("saveResult", {turnsTaken: 7 - this.turnsLeft, won: true})
      } else if (this.turnsLeft == 0) {
        this.showLost = true
        this.$store.commit("saveResult", {turnsTaken: 7, won: false})
      }
    },
    clubCorrect(clubGuess) {
      return clubGuess == this.mysteryPlayer.current_club
    },
    positionCorrect(positionGuess) {
      return positionGuess == this.mysteryPlayer.position
    },
    countryCorrect(countryGuess) {
      return countryGuess == this.mysteryPlayer.nationality
    },
    continentCorrect(continentGuess) {
      return continentGuess == this.mysteryPlayer.continent
    },
    ageCorrect(ageGuess) {
      return ageGuess == this.mysteryPlayer.age
    },
    ageClose(ageGuess) {
      let closeArray = []
      let cAge = this.mysteryPlayer.age
      for (let i = cAge - 2; i <= cAge + 2; i++) {
        closeArray.push(i)
      }
      return closeArray.includes(ageGuess)
    },
    colourCorrect(colourGuess) {
      return colourGuess == this.mysteryPlayer.kit_colour
    },
    colourHalfCorrect(colourGuess) {
      let cols = this.mysteryPlayer.kit_colour.split(" / ")
      let gCols = colourGuess.split(" / ")
      return cols.filter(val => gCols.includes(val)).length > 0
    },
    closeShowWon() {
      this.showWon = false
    },
    closeShowLost() {
      this.showLost = false
    },
    copyToClipboard() {

      // let results = document.getElementById("gameResults")
      // setClipboard(results.innerHTML)

      // function setClipboard(text) {
      //   var type = "text/plain";
      //   var blob = new Blob([text], { type });
      //   var data = [new ClipboardItem({ [type]: blob })];

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 30px;
  margin-bottom: 1rem;
}
@media only screen and (min-width: 600px) {
  h1 {
    font-size: 40px;
  }
}
@media only screen and (min-width: 1000px) {
  h1 {
    font-size: 50px;
  }
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
}
li:hover {
  background: #DEF2F1;
}
a {
  color: #42b983;
}
.hide {
  display: none;
}
.modal {
  display: flex;
  justify-content: center;
  z-index: 50;
  padding: 3rem;
  border-radius: 25px;
  position: absolute; 
  left: 0;
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  min-width: 240px;
  max-width: 480px; 
  margin-bottom: 5rem;
  top: 10rem; 
  border: 1px solid lightblue; 
  background: #fff
}
.modal-backdrop {
  opacity: 0.5 !important;
}
.search-input {
  max-width: 480px;
  min-width: 80px;
  padding: 1rem; 
  font-size: 20px; 
  position: relative; 
  margin-right: auto;
  margin-left: auto;
}
.search {
  position: absolute; 
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto; 
  max-width: 480px;
  min-width: 80px;
  margin-bottom: 5rem;
}
.search-result {
  cursor: pointer; 
  z-index: 50; 
  position: relative; 
  background: white; 
  min-width: 340px;
  max-width: 100%;
  padding: 1rem;
}
.name {
  background: #DEF2F1;
}
.wrapper {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  grid-auto-rows: minmax(50px, auto);
}
@media only screen and (min-width: 600px) {
  .wrapper {
    margin: auto;
    width: 80%;
  }
}
@media only screen and (min-width: 1000px) {
  .wrapper {
    margin: auto;
    width: 50%;
  }
}

.mini-wrapper {
  justify-content: center;
  margin-inline: auto;
  display: grid;
  width: 50%;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: minmax(15px, auto);
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  font-size: 2vmin;
}
.title-cell {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2vmin;
}
.cell-border-top {
  border-top: 2px solid #fff;
}
@media only screen and (min-width: 600px) {
  .cell-border-top {
    border-top: 4px solid #fff;
  }
}
.cell-border {
  border-right: 2px solid #fff;
}
@media only screen and (min-width: 600px) {
  .cell-border {
    border-right: 4px solid #fff;
  }
}
.correct {
  background: #37be75;
  color: #FEFFFF
}
.incorrect {
  background: #878a8c;
  color: #FEFFFF
}
.close {
  background: #ffa64d;
  color: #FEFFFF
}
</style>
