// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import VueAxios from 'vue-axios';
import Vuex from 'vuex'


Vue.config.productionTip = false

// 用 axios 进行 Ajax 请求
Vue.use(VueAxios, axios);

// Vuex 进行状态管理
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    musicData: [],
    channels: [],
    skinColor: localStorage.skinColor || '#058ecc',
    isShowIndex: true,
    isPlaying: false,
    isAnimation: false,
    isShowMiniMusic: false,
    linkBorderIndex: '',
    lrcresult: [],
    DOM: {},
    audio: {
      name: '',
      src: '',
      musicImgSrc: '',
      lrc: '',
      index: 0
    }
  },
  mutations: {
    del(state, index) {
      if (state.musicData.length === 0) {
        return;
      }
      state.musicData.splice(index, 1);
    },
    play(state, flag) {
      state.isPlaying = flag;
    },
    addMusic(state, payload) {
      for (let music of state.musicData) {
        if (JSON.stringify(music) === JSON.stringify(payload)) {
          return;
        }
      }
      state.musicData.unshift(payload);
    },
    toggleMusic(state, index) {
      state.audio.name = state.musicData[index].name;
      state.audio.src = state.musicData[index].src;
      state.audio.musicImgSrc = state.musicData[index].musicImgSrc;
      state.audio.index = index;
      state.audio.lrc = state.audio.src.replace(/.*\/(\d+).mp3.*/, "$1");
      state.lrcresult = [];
      if (state.audio.lrc !== '') {
        Vue.axios.get('/api/lrc/' + state.audio.lrc).then(function (res) {
          var lines = res.data.split('\n'),
            pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
            result = [],
            tempresult;
          if (lines.length === 0) {
            return;
          }
          while (!pattern.test(lines[0]) && lines.length !== 0) {
            lines = lines.slice(1);
          };
          lines[lines.length - 1].length === 0 && lines.pop();
          for (let step = 0; step < lines.length; step++) {
            let data = lines[step];
            let index = data.indexOf(']');
            let time = data.substring(0, index + 1),
              value = data.substring(index + 1);
            let timeString = time.substring(1, time.length - 2);
            let timeArr = timeString.split(':');
            result.push([parseInt(timeArr[0], 10) * 60 + parseFloat(timeArr[1]), value]);
          }
          tempresult = result;
          result = [];
          for (let step = 0; step < tempresult.length; step++) {
            let data = tempresult[step];
            if (data[1] !== '') {
              result.push(data);
            }
          }
          result.sort(function (a, b) {
            return a[0] - b[0];
          });
          state.lrcresult = result;
        })
      }
    },
    togglechannel(state, index) {
      Vue.axios.get("https://jirenguapi.applinzi.com/fm/getSong.php?channel=" + state.channels[index]).
      then(function (res) {
        state.audio.lrc = '';
        state.audio.name = res.data.song[0].artist + '---' + res.data.song[0].title;
        state.audio.src = res.data.song[0].url;
        state.audio.musicImgSrc = res.data.song[0].picture;
        state.audio.lrc = res.data.song[0].lrc;
        state.audio.index = index;
      }).then(function () {
        state.lrcresult = [];
        if (state.audio.lrc !== '') {
          Vue.axios.get(state.audio.lrc).then(function (res) {
            var lines = res.data.split('\n'),
              pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
              result = [],
              tempresult;
            if (lines.length === 0) {
              return;
            }
            while (!pattern.test(lines[0]) && lines.length !== 0) {
              lines = lines.slice(1);
            };
            lines[lines.length - 1].length === 0 && lines.pop();
            for (let step = 0; step < lines.length; step++) {
              let data = lines[step];
              let index = data.indexOf(']');
              let time = data.substring(0, index + 1),
                value = data.substring(index + 1);
              let timeString = time.substring(1, time.length - 2);
              let timeArr = timeString.split(':');
              result.push([parseInt(timeArr[0], 10) * 60 + parseFloat(timeArr[1]), value]);
            }
            tempresult = result;
            result = [];
            for (let step = 0; step < tempresult.length; step++) {
              let data = tempresult[step];
              if (data[1] !== '') {
                result.push(data);
              }
            }
            result.sort(function (a, b) {
              return a[0] - b[0];
            });
            state.lrcresult = result;
          })
        }
      })
    },
    playMusic(state, payload) {
      state.audio.name = payload.name;
      state.audio.src = payload.src;
      state.audio.musicImgSrc = payload.imgSrc;
      state.isPlaying = true;
    },
    findDOM(state, payload) {
      state.DOM[payload.name] = payload.dom;
    },
    showIndex(state, flag) {
      state.isShowIndex = flag;
    },
    showMiniMusic(state, flag) {
      state.isShowMiniMusic = flag;
    },
    changeLinkBorderIndex(state, index) {
      state.linkBorderIndex = index;
    },
    changeSkinColor(state, color) {
      state.skinColor = color;
    }
  },
  actions: {
    getchannel({
      commit,
      state
    }) {
      if (localStorage.channels !== '[]' && localStorage.channels) {
        state.channels = JSON.parse(localStorage.channels);
        return;
      }
      return new Promise((resolve, reject) => {
        Vue.axios.get('https://jirenguapi.applinzi.com/fm/getChannels.php').
        then(function (res) {
            console.log(res.data.channels);
            state.channels = res.data.channels;
            localStorage.channels = JSON.stringify(res.data.channels);
          }).then(() => {
            commit('togglechannel', 0)
          })
          .catch(function (err) {
            console.log(err);
          });
        resolve();
      });
    },
    getData({
      commit,
      state
    }) {
      if (localStorage.musics !== '[]' && localStorage.musics) {
        state.musicData = JSON.parse(localStorage.musics);
        return;
      }
      return new Promise((resolve, reject) => {
        Vue.axios.get('/api/music-data')
          .then(res => {
            console.log(res.data.musicData);
            if (res.data.errno === 0) {
              state.musicData = res.data.musicData;
              localStorage.musics = JSON.stringify(state.musicData);
            }
          })
          .then(() => {
            commit('toggleMusic', 0)
          });
        resolve();
      });
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
