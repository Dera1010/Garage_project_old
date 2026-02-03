import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Element from '../views/Element.vue'
import ListElement from '../views/ListElement.vue'
import EditElement from '../views/EditElement.vue'
import FrontOffice from '../views/FrontOffice.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/front-office',
    name: 'front-office',
    component: FrontOffice
  },
  {
    path: '/dashboard',

    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/element',
    name: 'element',
    component: Element
  },
  {
    path: '/interventions',
    name: 'interventions',
    component: ListElement
  },
  {
    path: '/element/edit/:id',
    name: 'edit-element',
    component: EditElement
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
