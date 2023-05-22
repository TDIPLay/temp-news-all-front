import { useSessionStore } from "@/store/session";
import route from "@/router";
import { AxiosInstance } from "axios";

export function setInterceptors(axiosService: AxiosInstance) {
  // axiosService.interceptors.request.use(

  //   function (config) {
  //     config.headers.Authorization = `Bearer ${store.state.account.token}`;
  //     // 요청을 보내기 전에 어떤 처리를 할 수 있다.
  //     return config;
  //   },
  //   function (error) {
  //     // 요청이 잘못되었을 때 에러가 컴포넌트 단으로 오기 전에 어떤 처리를 할 수 있다.
  //     return Promise.reject(error);
  //   }
  // );

  axiosService.interceptors.response.use(
    function (response: any) {
      // 서버에 요청을 보내고 나서 응답을 받기 전에 어떤 처리를 할 수 있다.
      if (
        response?.data.data.result < 0 &&
        !["/login"].includes(route.currentRoute.value.path)
      ) {
        const { user, logout } = useSessionStore();

        // 로그인 세션 없는 경우
        logout().then((res) => {
          route.replace({ name: "login" });
        });
      }
      return response;
    },
    function (error: any) {
      // let errKey = error.response.data.err;
      // let errText = "";
      // if (error.response.status === 401) {
      //   if (route.app._route.name !== "LoginView") {
      //     location.reload();
      //   } else {
      //     errText = "로그인정보를 다시 확인해주세요";
      //   }
      // } else if (errKey === 111) {
      //   errText = "로그인이 필요합니다";
      // } else if (errKey === 112) {
      //   errText = "이미 사용중이 이메일입니다";
      // } else if (errKey === 147) {
      //   errText = "탈퇴 신청된 사용자가 아닙니다";
      // } else if (errKey === 151) {
      //   errText = "만료된 인증번호입니다.";
      // } else if (errKey === 121) {
      //   errText = "이메일 인증을 다시 시도해주세요";
      // } else if (errKey === 146) {
      //   errText = "올바른 코드가 아닙니다";
      // } else if (errKey === 211) {
      //   errText = "구독서비스를 이미 이용중입니다";
      // } else if (errKey === 215) {
      //   errText = "구독서비스를 이미 이용중인 계정입니다";
      // } else if (errKey === 212) {
      //   errText = "플랜을 구독중이지 않습니다";
      // } else if (errKey === 221) {
      //   errText = "구독서비스를 이미 이용중입니다";
      // } else if (errKey === 250) {
      //   errText = "구독서비스가 만료되었습니다";
      // } else if (errKey === 244) {
      //   errText = "취소할 수 있는 서비스가 없습니다.";
      // } else if (errKey === 251) {
      //   errText = "취소할 수 있는 시간이 지났습니다.";
      // } else if (errKey === 310) {
      //   errText = "관리 중인 키워드가 아닙니다";
      // } else if (errKey === 321) {
      //   errText = "키워드 검색 수를 초과했습니다";
      // } else if (errKey === 322) {
      //   errText = "키워드 그룹 수를 초과했습니다";
      // } else if (errKey === 323) {
      //   errText = "관리 키워드 수를 초과했습니다";
      // } else if (errKey === 444) {
      //   errText = "관리 중인 키워드가 아닙니다";
      // } else if (errKey === 400) {
      //   errText = "골드 회원만 이용할 수 있습니다.";
      // } else if (errKey === 521) {
      //   errText = "등록 키워드수를 초과했습니다.";
      // } else if (errKey === 523) {
      //   errText = "키워드는 2자 이상 입력해주세요";
      // } else if (error.response.status === 500) {
      //   errText = "서버오류! 관리자에게 문의하세요";
      // } else if (error.response.status === 429) {
      //   errText = "서버요청이 너무 많습니다. 잠시 후 다시 시도해주세요";
      // } else {
      //   errText = "잠시 후 다시 시도해주세요";
      // }

      // if (errKey !== 401) {
      //   store.commit("controller/setMsg", { message: errText, type: "error" });
      // }

      // 응답이 에러인 경우에 미리 전처리할 수 있다.
      return Promise.reject(error);
    }
  );

  return axiosService;
}
