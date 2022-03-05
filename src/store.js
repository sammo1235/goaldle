import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

// Create a new store instance.
export const store = createStore({
  plugins: [vuexLocal.plugin],
  state () {
    return {
      count: 0,
      guesses: {},
      resultsHistory: {}
    }
  },
  getters: {
    getGuesses(state) {
      let date = new Date().toLocaleString().split(", ")[0]
      return state.guesses[date]
    },
    getResultsHistory(state) {
      return state.resultsHistory
    },
    getResultsHistoryToday(state) {
      let date = new Date().toLocaleString().split(", ")[0]
      if (state.resultsHistory[date] != undefined) {
        return state.resultsHistory[date]
      } else {
        return null
      }
    },
    getResultsCountByScore(state, turnsTaken) {
      return state.resultsHistory.filter(result => result.turnsTaken == turnsTaken).length
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    addGuess (state, guess) {
      console.log("adding guess", guess)
      let date = new Date().toLocaleString().split(", ")[0]
      if (state.guesses[date] == undefined) {
        state.guesses[date] = [guess]
      } else {
        state.guesses[date].push(guess)
      }
    },
    saveResult (state, payload) {
      let date = new Date().toLocaleString().split(", ")[0]
      state.resultsHistory[date] = {turns_taken: payload.turnsTaken, won: payload.won}
    }
  }
})

