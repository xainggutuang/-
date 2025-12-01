import { createRouter, createWebHistory } from 'vue-router'
import Home from '../vue/Home.vue'
import MovieMap from '../vue/MovieMap.vue'
import MovieLibrary from '../vue/MovieLibrary.vue'
import Rankings from '../vue/Rankings.vue'
import Community from '../vue/Community.vue'
import CinemaSearch from '../vue/CinemaSearch.vue' // 添加这行

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/moviemap',
    name: 'MovieMap',
    component: MovieMap
  },
  {
    path: '/cinema-search', // 添加影院搜索路由
    name: 'CinemaSearch',
    component: CinemaSearch
  },
  {
    path: '/library',
    name: 'MovieLibrary',
    component: MovieLibrary
  },
  {
    path: '/rankings',
    name: 'Rankings',
    component: Rankings
  },
  {
    path: '/community',
    name: 'Community',
    component: Community
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router