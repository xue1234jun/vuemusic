<template>
  <div id="app">

    <!-- 主界面部分 -->
    <transition name="show">
      <div v-show="isShowIndex" class="index">

        <!-- 头部 -->
        <VHeader></VHeader>

        <!-- router控制的Tab页内容 -->
        <router-view></router-view>

        <!-- 尾部mini播放器 -->
        <VFooter></VFooter>
      </div>
    </transition>

    <!-- 播放界面 -->
    <transition name="showIndex">
      <Play v-show="!isShowIndex"></Play>
    </transition>

    <!-- 隐藏的audio标签 -->
    <audio v-bind:src="audio.src || (musicData[0]&&musicData[0].src) || defaultSrc" v-bind:autoplay="isPlaying" ref="audio"></audio>

  </div>
</template>

<script>
import VHeader from './components/Header/Header.vue';
import VFooter from './components/Footer/Footer.vue';
import Play from './components/Play/Play.vue';

export default {
  name: 'app',
  components: {
    VHeader,
    VFooter,
    Play
  },
  beforeCreate() {
    this.$store.dispatch('getData');
  },
  mounted() {
    this.$store.commit('findDOM', {name: 'audio', dom: this.$refs.audio});
    this.$refs.audio.addEventListener('ended', () => { this.next(); });
    this.$refs.audio.addEventListener('error', () => { this.next(); });
  },
  computed: {
    linkBorderIndex(){
      return this.$store.state.linkBorderIndex;
    },
    audio() {
      return this.$store.state.audio;
    },
    isPlaying() {
      return this.$store.state.isPlaying;
    },
    DOM() {
      return this.$store.state.DOM;
    },
    isShowSearch() {
      return this.$store.state.isShowSearch;
    },
    isShowIndex() {
      return this.$store.state.isShowIndex;
    },
    musicData() {
      return this.$store.state.musicData;
    }
  },
  data() {
    return {
      defaultSrc: 'http://m2.music.126.net/K1SFXCvWf8BO9VEpSvx2ew==/7967061257205150.mp3'
    };
  },
  methods: {
    next() {
      if(this.linkBorderIndex === 3)
      {
        this.$store.commit('togglechannel', this.audio.index);
      }else{
        this.audio.index = this.audio.index === this.musicData.length - 1 ? 0 : (++this.audio.index);
        this.$store.commit('toggleMusic', this.audio.index);
      }

    }
  }
}
</script>

<style lang="scss">
@import "./common/style/base.scss";

.showIndex-enter-active {
  transition: all .4s ease-out;
}
.showIndex-leave-active {
  transition: all 0 ease;
}
.showIndex-enter, .showIndex-leave-active {
  transform: translateY(350px);
  opacity: 0;
}
.show-enter-active {
  transition: all .4s ease;
}
.show-leave-active {
  transition: all 0 ease-out;
}
.show-enter, .show-leave-active {
  transform: translateX(-350px);
  opacity: 0;
}

.down-enter-active {
  transition: all .2s ease-in-out;
}
.down-leave-active {
  transition: all .4s ease-in-out;
}
.down-enter, .down-leave-active {
  transform: translateY(-250px);
  opacity: 0;
}

#app, .index {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  div.search-page {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    z-index: 1;
    // background-color: rgba(0, 0, 0, .5);

    .search-input {
      position: relative;
      flex: 1.1;
      width: 100%;
      background-color: white;
      border: none;
      input {
        width: 90%;
        height: 100%;
        padding: 0 55px 0 30px;
        outline: none;
        border: none;
        font-size: 1.2rem;
      }
      i.icon-search {
        position: absolute;
        top: 9px;
        right: 55px;
        display: inline-block;
        width: 25px;
        height: 25px;
        background: url('./assets/search.svg') no-repeat;
        background-size: contain;
      }
      span {
        display: inline-block;
        position: absolute;
        right: 10px;
        top: 10px;
        width: 23px;
        height: 23px;
        background: url('./assets/close.svg') no-repeat;
        background-size: contain;
      }
    }
    .mask {
      flex: 15;
    }
  }

}
</style>
