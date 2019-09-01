import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/users/Users'
import Roles from '@/components/roles/Roles'
import Rights from '@/components/rights/Rights'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {path: '/users/:page?', name: 'users', component: Users},
        {path: '/rights', name: 'rights', component: Rights},
        {path: '/roles', name: 'roles', component: Roles}
      ]
    }
  ]
})
