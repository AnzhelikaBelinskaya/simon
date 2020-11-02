<template>
  <div id="app">
    <h1 class="game__title">Simon Says</h1>
    <div class="container">
      <div class="panel__wrapper">
        <div
          class="game__panel"
          :class="{
            active: currentPanel === panel.id,
            enabled: buttonsEnabled,
          }"
          @click="pushPlayerOrder(panel.id)"
          v-for="panel in $options.panels"
          :key="panel.id"
          :id="panel.id"
        ></div>
      </div>
      <div class="game__info">
        <div class="round__counter">Round: {{ currentRound }}</div>
        <div class="start__button" @click="startGame">Play</div>
        <div class="game__status" v-if="lost">Sorry, you lost after {{ currentRound }} rounds</div>
        <div class="game__options">
          <div class="modes">
            <h2 class="modes__title">Mode</h2>
            <input
              name="mode"
              value="easy"
              type="radio"
              v-model="mode"
              class="input"
            />Easy
            <br />
            <input
              name="mode"
              value="medium"
              type="radio"
              v-model="mode"
              class="input"
            />Medium
            <br />
            <input
              name="mode"
              value="hard"
              type="radio"
              v-model="mode"
              class="input"
            />Hard <br /><input
              type="checkbox"
              class="input"
              v-model="soundsEnabled"
            />Sounds Enabled
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { panels } from "./data/panels.data";
import { modes } from "./data/modes.data";
export default {
  name: "App",
  panels,
  modes,
  data() {
    return {
      order: [],
      playerOrder: [],
      currentRound: null,
      flash: 1,
      mode: "medium", //medium and hard
      buttonsEnabled: false,
      currentPanel: null,
      intervalId: "",
      sound: "",
      soundsEnabled: true,
      lost: false,
    };
  },
  computed: {
    interval() {
      return modes[this.mode].interval;
    },
    timeout() {
      return modes[this.mode].timeout;
    },
  },
  methods: {
    startGame() {
      this.clearAll();
      this.startGameRound();
    },

    startGameRound() {
      this.pushRandomPanel();
      this.intervalId = setInterval(this.showOrder, this.interval);
    },

    clearAll() {
      this.lost = false;
      this.order = [];
      this.playerOrder = [];
      this.currentRound = 1;
      this.buttonsEnabled = false;
      this.currentPanel = null;
      this.flash = 1;
    },

    pushRandomPanel() {
      this.order.push(Math.floor(Math.random() * 4) + 1);
    },
    showOrder() {
      if (this.currentRound >= this.flash) {
        const panel = this.order[this.flash - 1];
        this.lightenPanel(panel);
        this.playSound(panel);
        this.flash++;
        this.darkenPanel();
      } else {
        clearInterval(this.intervalId);
        this.darkenPanel();
        this.buttonsEnabled = true;
      }
    },

    lightenPanel(panel) {
      this.currentPanel = panel;
    },

    playSound(panel) {
      if (this.soundsEnabled) {
        this.sound = panels[panel - 1].sound;
        const audio = new Audio(this.sound);
        audio.play();
      }
    },

    darkenPanel() {
      setTimeout(() => {
        this.currentPanel = null;
      }, this.timeout);
    },

    pushPlayerOrder(id) {
      if (this.buttonsEnabled) {
        this.playerOrder.push(id);
        this.playSound(id);
        this.lightenPanel(id);
        this.darkenPanel();
        this.checkResult(id);
      }
    },
    goNextRound() {
      this.buttonsEnabled = false;
      this.flash = 1;
      this.playerOrder = [];
      this.currentRound++;
      setTimeout(() => {
        this.startGameRound();
      }, 500);
    },
    checkResult(id) {
      if (id === this.order[this.playerOrder.length - 1]) {
        if (this.currentRound === this.playerOrder.length) {
          this.goNextRound();
        }
      } else {
        this.lost = true;
        this.buttonsEnabled = false;
      }
    },
  },
};
</script>

<style lang="scss">
body {
  font-family: Arial, serif;
}
#app {
  width: 700px;
  margin: 0 auto;
}
.game__title {
  margin: 1em 0 2em;
  text-align: center;
}
.game__info {
  display: inline-block;
}
.panel__wrapper {
  float: left;
  background: #fff;
  position: relative;
  margin-right: 3em;
  width: 302px;
  height: 295px;
  -webkit-border-radius: 150px 150px 150px 150px;
  border-radius: 150px 150px 150px 150px;
  -moz-box-shadow: 2px 1px 12px #aaa;
  -webkit-box-shadow: 2px 1px 12px #aaa;
  -o-box-shadow: 2px 1px 12px #aaa;
  box-shadow: 2px 1px 12px #aaa;
}
.round__counter {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
.start__button {
  width: 5em;
  text-align: center;
  box-sizing: border-box;
  font-size: 1.4em;
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #6dabe8;
  border: none;
  padding: 0.3em 0.6em;
  cursor: pointer;
  &:hover {
    background: #78bcff;
  }
}
.game__status {
  margin-top: 10px;
}
.game__options {
  margin-top: 30px;
  margin-bottom: 0;
  font-size: 1.5em;
  font-weight: bold;
}
.game__panel.active {
  opacity: 0.9;
}
.game__panel {
  opacity: 0.6;
  height: 290px;
  -webkit-border-radius: 150px 150px 150px 150px;
  border-radius: 150px 150px 150px 150px;
  position: absolute;
  text-indent: 10000px;
  &:hover {
    border: 2px solid black;
  }
  &.enabled {
    cursor: pointer;
  }

  &:nth-child(1) {
    background: dodgerblue;
    clip: rect(0px, 150px, 150px, 0px);
    width: 300px;
  }
  &:nth-child(2) {
    background: #ff5643;
    clip: rect(0px, 300px, 150px, 150px);
    width: 296px;
  }
  &:nth-child(3) {
    background: #feef33;
    clip: rect(150px, 150px, 300px, 0px);
    width: 300px;
  }
  &:nth-child(4) {
    background: #bede15;
    clip: rect(150px, 300px, 300px, 150px);
    width: 296px;
  }
}
.modes {
  font-size: 14px;
  font-weight: 400;
}
.modes__title {
  margin-top: 30px;
  margin-bottom: 0;
  font-size: 1.5em;
}
.input {
  margin-right: 15px;
  margin: 5px;
}
</style>