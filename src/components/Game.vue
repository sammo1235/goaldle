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
    <div id="gameResultsShared" v-for="guess in guesses" v-bind:key="guess.id">
    </div>
    <div style="display: flex; flex-direction: row; margin-top: 1rem;">
      <button @click="copyToClipboard()" id="copybtn" class="button-43" role="button">Share</button>
      <button @click="closeShowWon()" class="button-43" role="button">Close</button>
    </div>
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
        <div class="cell cell-border name cell-border-top cell-spin-1">{{ guess.full_name }}</div>
        <div :class="[clubCorrect(guess.current_club) ? 'correct' : 'incorrect', 'cell cell-border cell-border-top cell-spin-2']">{{ guess.current_club }}</div>
        <div :class="[positionCorrect(guess.position) ? 'correct' : 'incorrect', 'cell cell-border cell-border-top cell-spin-3']">{{ guess.position }}</div>
        <div :class="[countryCorrect(guess.nationality) ? 'correct' : continentCorrect(guess.continent) ? 'close' : 'incorrect', 'cell cell-border cell-border-top cell-spin-4']">{{ guess.nationality }}</div>
        <div :class="[ageCorrect(guess.age) ? 'correct' : ageClose(guess.age) ? 'close' : 'incorrect', 'cell cell-border cell-border-top cell-spin-5']">{{ guess.age }}</div>
        <div :class="[colourCorrect(guess.kit_colour) ? 'correct' : colourHalfCorrect(guess.kit_colour) ? 'close' : 'incorrect', 'cell cell-border-top cell-spin-6']">{{ guess.kit_colour }}</div>
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
      var diacritics = {
        a: 'ÀÁÂÃÄÅàáâãäåĀāąĄ',
        c: 'ÇçćĆčČ',
        d: 'đĐďĎ',
        e: 'ÈÉÊËèéêëěĚĒēęĘ',
        i: 'ÌÍÎÏìíîïĪī',
        l: 'łŁ',
        n: 'ÑñňŇńŃ',
        o: 'ÒÓÔÕÕÖØòóôõöøŌō',
        r: 'řŘ',
        s: 'ŠšśŚ',
        t: 'ťŤ',
        u: 'ÙÚÛÜùúûüůŮŪū',
        y: 'ŸÿýÝ',
        z: 'ŽžżŻźŹ'
      }

      function replaceDiacritics(text) { return text .split('') .map(l => Object.keys(diacritics).find(k => diacritics[k].includes(l)) || l) .join(''); }
      let players = this.playerDatabase.filter(player => {
        return replaceDiacritics(player.full_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")).includes(this.search.toLowerCase())
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
        const $this = this;
        setTimeout(function() {
          $this.showWon = true
          $this.gameFinished = true
          $this.$store.commit("saveResult", {turnsTaken: 7 - this.turnsLeft, won: true})
        }, 1000)
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
      let str = `Goaldle 1 ${7-this.turnsLeft}/7 \n`
      var guesses = this.guesses
      // let results = document.getElementById("gameResults")
      for(var i = 0; i<this.guesses.length; i++) {
        if (this.clubCorrect(guesses[i].current_club)) {
          str += "🟩" 
        } else {
          str += "⬜"
        }
        if (this.positionCorrect(guesses[i].position)) {
          str += "🟩" 
        } else {
          str += "⬜"
        }
        if (this.countryCorrect(guesses[i].nationality)) {
          str += "🟩"
        } else if (this.continentCorrect(guesses[i].continent)) {
          str += "🟨"
        } else {
          str += "⬜"
        }
        if (this.ageCorrect(guesses[i].age)) {
          str += "🟩"
        } else if (this.ageClose(guesses[i].age)) {
          str += "🟨"
        } else {
          str += "⬜"
        }
        if (this.colourCorrect(guesses[i].kit_colour)) {
          str += "🟩"
        } else if (this.colourHalfCorrect(guesses[i].kit_colour)) {
          str += "🟨"
        } else {
          str += "⬜"
        }
        str += "\n"
      }


      function copyRichText(text) {
        const listener = function(ev) {
          ev.preventDefault();
          ev.clipboardData.setData('text/html', text);
          ev.clipboardData.setData('text/plain', text);
        };
        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);
      }

      if (str) {
        let result;
        let textarea;
        try {
          textarea = document.createElement('textarea');
          textarea.setAttribute('readonly', true);
          textarea.setAttribute('contenteditable', true);
          textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
          textarea.value = str;

          document.body.appendChild(textarea);
          
          textarea.focus();
          textarea.select();

          const range = document.createRange();
          range.selectNodeContents(textarea);

          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          textarea.setSelectionRange(0, textarea.value.length);
          result = document.execCommand('copy');
        } catch (err) {
          console.error(err);
          result = null;
        } finally {
          document.body.removeChild(textarea);
        }
        // manual copy fallback using prompt
        if (!result) {
          const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
          const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
          result = prompt(`Press ${copyHotkey}`, str); // eslint-disable-line no-alert
          if (!result) {
            return false;
          }
        }
        return true;
      } else {
        copyRichText(str);
      }
      document.getElementById('copybtn').innerHTML = "Copied!"
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
@keyframes spin { 
    from { 
        transform: rotateY(180deg); 
    } to { 
        transform: rotateY(360deg); 
    }
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 1.5rem;
  padding: 1rem;
  font-size: 10px;
}
@media only screen and (min-width: 600px) {
  .cell {
    font-size: 18px;
  }
}
@media only screen and (min-width: 1000px) {
  .cell {
    font-size: 21px;
  }
}
.cell-spin-1 {
  animation: spin .2s linear;
}
.cell-spin-2 {
  animation: spin .4s linear;
}
.cell-spin-3 {
  animation: spin .6s linear;
}
.cell-spin-4 {
  animation: spin .8s linear;
}
.cell-spin-5 {
  animation: spin 1s linear;
}
.cell-spin-6 {
  animation: spin 1.2s linear;
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
