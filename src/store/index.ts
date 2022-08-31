import { createStore } from "vuex";
import AuthService from "@/services/AuthService";
import { Models, Constants, Vocabulary } from "im-library";
const { IM } = Vocabulary;
const { Avatars } = Constants;
const { CustomAlert } = Models;
import vm from "@/main";

export default createStore({
  state: {
    currentUser: {} as Models.User,
    isLoggedIn: false as boolean,
    snomedLicenseAccepted: localStorage.getItem("snomedLicenseAccepted") as string,
    snomedReturnUrl: "",
    authReturnUrl: "",
    tagSeverityMatches: [
      { "@id": IM.ACTIVE, severity: "success" },
      { "@id": IM.DRAFT, severity: "warning" },
      { "@id": IM.INACTIVE, severity: "danger" }
    ],
    activeProfile: { uuid: "", activeClausePath: "" }
  },
  mutations: {
    updateActiveProfile(state, value) {
      state.activeProfile = value;
    },
    updateCurrentUser(state, user) {
      state.currentUser = user;
    },
    updateIsLoggedIn(state, status) {
      state.isLoggedIn = status;
    },
    updateSnomedLicenseAccepted(state, status: string) {
      state.snomedLicenseAccepted = status;
      localStorage.setItem("snomedLicenseAccepted", status);
    },
    updateSnomedReturnUrl(state, url) {
      state.snomedReturnUrl = url;
    },
    updateAuthReturnUrl(state, url) {
      state.authReturnUrl = url;
    },
    updateTagSeverityMatches(state, items) {
      state.tagSeverityMatches = items;
    }
  },
  actions: {
    async logoutCurrentUser({ commit }) {
      let result = new CustomAlert(500, "Logout (store) failed");
      await AuthService.signOut().then(res => {
        if (res.status === 200) {
          commit("updateCurrentUser", null);
          commit("updateIsLoggedIn", false);
          result = res;
        } else {
          result = res;
        }
      });
      return result;
    },
    async authenticateCurrentUser({ commit, dispatch }) {
      const result = { authenticated: false };
      await AuthService.getCurrentAuthenticatedUser().then(res => {
        if (res.status === 200 && res.user) {
          commit("updateIsLoggedIn", true);
          const loggedInUser = res.user;
          const foundAvatar = Avatars.find((avatar: string) => avatar === loggedInUser.avatar);
          if (!foundAvatar) {
            loggedInUser.avatar = Avatars[0];
          }
          commit("updateCurrentUser", loggedInUser);
          result.authenticated = true;
        } else {
          dispatch("logoutCurrentUser").then(resLogout => {
            if (resLogout.status === 200) {
              vm.$loggerService.info(undefined, "Force logout successful");
            } else {
              vm.$loggerService.error(undefined, "Force logout failed");
            }
          });
        }
      });
      return result;
    }
  },
  modules: {}
});
