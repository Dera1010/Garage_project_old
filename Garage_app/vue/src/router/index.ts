import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Element from '../views/Element.vue'
import ListElement from '../views/ListElement.vue'
import EditElement from '../views/EditElement.vue'
import ListClient from '../views/ListClient.vue'
import ListReparation from '../views/ListReparation.vue'
import InfoClient from '../views/InfoClient.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login
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
  },
  {
    path: '/list-clients',
    name: 'list-clients',
    component: ListClient
  },
  {
    path: '/list-reparations',
    name: 'list-reparations',
    component: ListReparation
  },
  {
    path: '/info-client',
    name: 'info-client',
    component: InfoClient
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
