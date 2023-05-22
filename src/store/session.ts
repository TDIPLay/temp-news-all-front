import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { axiosService } from "@/api/index";

export interface LoginProps {
  id: string;
  pwd: string;
}

export const useSessionStore = defineStore("session", () => {
  /**@description: state */
  const user = ref<any>(null);
  const token = ref<any>(null);
  const record = ref<boolean>(false);
  const subscription = ref<boolean>(false);

  const login = async ({ id, pwd }: LoginProps) => {
    try {
      const response = await axiosService.post(`/Auth/AuthProcess`, {
        account_id: id,
        account_pw: pwd,
      });
      const { data } = response.data;

      if (data.result) {
        // attempt();
        setUserInfo({
          id: id,
          name: data.name,
          type: data.account_type,
        });
        localStorage.setItem("user_name", JSON.stringify(user.value.name));
        localStorage.setItem(
          "user_account_type",
          JSON.stringify(user.value.type)
        );
      }
      return data;
    } catch (error) {
      return error;
    }
  };

  const snsLogin = async (params: any) => {
    try {
      const response = await axiosService.post(`/Auth/SnsAuthProcess`, params);
      const { data } = response.data;
      // console.log("snsLogin", response.data);
      if (data.result) {
        setUserInfo({
          id: data.id,
          name: data.name,
          type: data.account_type,
        });
        localStorage.setItem("user", JSON.stringify(data.id));
        localStorage.setItem("user_name", JSON.stringify(data.name));
        localStorage.setItem("type", JSON.stringify(params.type));
      }
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const logout = async () => {
    try {
      const { data } = await axiosService.post(`/Auth/AuthDestoryProcess`);

      if (data.data.result) {
        return data.data;
      }
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      user.value = null;
      token.value = null;
      record.value = false;
      subscription.value = false;
      // localStorage.removeItem("user");
      localStorage.removeItem("type");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_account_type");
    }
  };

  const setUserInfo = (param: any) => {
    user.value = param;
    console.log("setUserInfo", param);
  };

  // 로그인 정보 가져오기
  const attempt = async (account_no: string) => {
    // if (!account_no) return;
    // // console.log(authToken);
    // // if (!authToken) return;

    // // token.value = authToken;

    // try {
    //   // const response = await UserAPI.getUserInfo(account_no);
    //   // const { account } = response.data;
    //   // console.log(response.data);

    //   // let endDate = moment(response.data.subscription?.end_at).format(
    //   //   "YYYY-MM-DD"
    //   // ); //종료 날짜
    //   // let response = {
    //   //   data: {
    //   //     subscription: {
    //   //       end_at: moment().endOf("day").format("YYYY-MM-DD"), //종료 날짜,
    //   //     },
    //   //     isSubscriber: true, // 구독자여부
    //   //   },
    //   // };

    //   // let endDate = response.data.subscription?.end_at;
    //   // let data2 = moment(moment()).isBefore(endDate); //기간이 지났는지 안지났는지 false 인 경우 안지남 / 없음 true 인 경우 기간 지남

    //   // record.value = response.data.subscription !== null && !data2;
    //   // subscription.value = response.data.isSubscriber && !!data2;
    //   // user.value = response.data;

    //   // return response;
    // } catch (error) {
    //   let active = await CommonUtils.AppUtility("logout");
    //   if (!active) {
    //     logout();
    //   }
    // }

    return;
  };

  return {
    isLogin: computed(() => !!user.value),
    user: computed(() => user),
    login,
    snsLogin,
    logout,
    setUserInfo,
    attempt,
  };
});
