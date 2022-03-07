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
      const ms_per_hour = 1 * 60 * 60 * 1000
      let hours_since_epoch = Math.floor((new Date()).getTime() / ms_per_hour)

      return state.guesses[hours_since_epoch]
    },
    getResultsHistory(state) {
      return state.resultsHistory
    },
    getResultsHistoryForTimePeriod(state) {
      const ms_per_hour = 1 * 60 * 60 * 1000
      let hours_since_epoch = Math.floor((new Date()).getTime() / ms_per_hour)
      if (state.resultsHistory[hours_since_epoch] != undefined) {
        return state.resultsHistory[hours_since_epoch]
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
      const ms_per_hour = 1 * 60 * 60 * 1000
      let hours_since_epoch = Math.floor((new Date()).getTime() / ms_per_hour)

      if (state.guesses[hours_since_epoch] == undefined) {
        state.guesses[hours_since_epoch] = [guess]
      } else {
        state.guesses[hours_since_epoch].push(guess)
      }
    },
    saveResult (state, payload) {
      const ms_per_hour = 1 * 60 * 60 * 1000
      let hours_since_epoch = Math.floor((new Date()).getTime() / ms_per_hour)
      state.resultsHistory[hours_since_epoch] = {turns_taken: payload.turnsTaken, won: payload.won}
    }
  }
})

