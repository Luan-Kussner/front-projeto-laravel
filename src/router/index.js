import { createRouter, createWebHistory } from "vue-router";
import beforeEach from "./beforeEach";

const routes = [
  {
    path: "/",
    name: "layout",
    component: () =>
      import(/* webpackChunkName: "layout" */ "@/views/Layout/Main.vue"),
    children: [
      {
        path: "/",
        name: "dashboard",
        component: () => import("@/views/Dashboard/Main.vue"),
      },
      {
        path: "/vendas",
        name: "controls",
        component: () =>
          import(/* webpackChunkName: "controls" */ "@/views/Control/Main.vue"),
        children: [
          {
            path: "",
            name: "homeControl",
            component: () => import(
              /* webpackChunkName: "controls" */ "@/views/Control/Home/Main.vue"
            ),
          },
          {
            path: "adicionar/:id",
            name: "formControl",
            meta: { auth: true },
            component: () =>
              import(
                /* webpackChunkName: "controls" */ "@/views/Control/Form/Main.vue"
              ),
          },
        ],
      },
      {
        path: "/clientes",
        name: "clients",
        component: () =>
          import(/* webpackChunkName: "client" */ "@/views/Clients/Main.vue"),
        children: [
          {
            path: "",
            name: "homeClients",
            component: () => import(
              /* webpackChunkName: "client" */ "@/views/Clients/Home/Main.vue"
            ),
          },
          {
            path: "adicionar/:id",
            name: "formClients",
            meta: { auth: true },
            component: () =>
              import(
                /* webpackChunkName: "client" */ "@/views/Clients/Form/Main.vue"
              ),
          },
        ],
      },
      {
        path: "/produtos",
        name: "products",
        component: () =>
          import(/* webpackChunkName: "product" */ "@/views/Products/Main.vue"),
        children: [
          {
            path: "",
            name: "homeProducts",
            component: () =>
              import(
                /* webpackChunkName: "product" */ "@/views/Products/Home/Main.vue"
              ),
          },
          {
            path: "adicionar/:id",
            name: "formProducts",
            meta: { auth: true },
            component: () =>
              import(
                /* webpackChunkName: "product" */ "@/views/Products/Form/Main.vue"
              ),
          },
        ],
      },
            {
        path: "/orders",
        name: "orders",
        component: () =>
          import(/* webpackChunkName: "order" */ "@/views/Orders/Main.vue"),
        children: [
          {
            path: "",
            name: "homeOrders",
            component: () =>
              import(
                /* webpackChunkName: "order" */ "@/views/Orders/Home/Main.vue"
              ),
          },
          {
            path: "adicionar/:id",
            name: "formOrders",
            meta: { auth: true },
            component: () =>
              import(
                /* webpackChunkName: "order" */ "@/views/Orders/Form/Main.vue"
              ),
          },
        ],
      },
      {
        path: "/perfil",
        name: "profile",
        meta: { auth: true },
        component: () =>
          import(/* webpackChunkName: "product" */ "@/views/Profile/Main.vue"),
      },
    ],
  },
  {
    path: "/inicio/:callback?",
    name: "init",
    component: () => import(/* webpackChunkName: "init" */ "@/views/Init/Main.vue"),
  }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(beforeEach);

export default router;
