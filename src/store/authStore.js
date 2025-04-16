import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import api from "@/services/Api.js";

export const authUser = defineStore("authUser", () => {
  const user = reactive({
    id: null,
    name: null,
    email: null,
    is_admin: null,
    token: null,
  });

  const getUser = computed(() => user);
  const getToken = computed(() => user.token);

  const setUser = ({ user: { id, name, email, is_admin }, token }) => {
    user.id = id;
    user.name = name;
    user.email = email;
    user.is_admin = is_admin;
    user.token = token;

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setLocalStorage(token);
  };

  const setLocalStorage = (token) => {
    const tokenOnly = token.includes('|') ? token.split('|')[1] : token;
    localStorage.setItem("@token", tokenOnly);
  };

  const getTokenStorage = () => {
    return new Promise((resolve, reject) => {
      const storage = localStorage.getItem("@token");

      if (storage) {
        const token = storage;

        if (token)
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return api
          .get("/auth/validate")
          .then(({data}) => {
            if (data.token) {
              setUser(data);
              resolve(token);
              return;
            }

            resolve(null);
          })
          .catch((error) => {
            reject(error);
            return;
          });
      }

      resolve(null);
    });
  };

  const logout = () => {
    user.id = null;
    user.fullName = null;
    user.email = null;
    user.role = null;
    user.token = null;

    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("@token");
  };

  return {
    setUser,
    getUser,
    getToken,
    getTokenStorage,
    logout,
  };
});
