import Vue from 'vue'
import './firebaseConfig'
import firebase from 'firebase/app'
import 'firebase/auth'
import App from './components/App.vue'
import Admin from './components/Admin.vue'
import Quiz from './components/Quiz.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
let router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/', component: Quiz},
    {path: '/admin', component: Admin}
  ]
})
// import {ValidationProvider} from 'vee-validate'
import 'animate.css/animate.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
Vue.config.productionTip = false
// Vue.use(ValidationProvider)
let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      render: h => h(App)
    })
  }
})
