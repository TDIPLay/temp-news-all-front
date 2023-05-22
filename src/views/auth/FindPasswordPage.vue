<template>
  <div style="height: 100%; padding-bottom: 100px">
    <header>
      <div class="container-header">
        <div class="header-title">
          <h1>
            <a @click="goHome">
              <img
                src="@/assets/img/main_logo.png"
                alt="로고"
                style="width: 100%"
              />
            </a>
          </h1>
        </div>
      </div>
    </header>

    <!-- section: login form -->
    <section class="login_form-wrap">
      <div class="login_form-login white_box">
        <div class="login_form-container">
          <h2>Login</h2>

          <div class="login_form user_id">
            <div class="login_form-inner">
              <label for="userId">아이디</label>
              <input
                v-model="email"
                type="text"
                id="userId"
                :class="{ input_common_style, error_box: userId }"
                placeholder="아이디를 입력해주세요."
                @keydown.enter="submit"
              />
            </div>
            <p
              style="margin-bottom: 0"
              :class="{ help_txt, error_box: userId }"
              v-html="userErrMsg"
            ></p>
          </div>

          <div class="login_form user_pw">
            <div class="login_form-inner">
              <label for="passWd">비밀번호</label>
              <input
                v-model="password"
                :type="passType"
                id="passWd"
                class="input_common_style"
                placeholder="비밀번호를 입력해주세요."
                :class="{ input_common_style, error_box: userPass }"
                @keydown.enter="submit"
              />

              <!-- active: The class name of password icon 'active' is default -->
              <span class="icon_password-btn">
                <img
                  src="@/assets/img/icon_password-eyes-active.svg"
                  alt="패스워드 아이즈 활성화"
                  :class="{ active: passType === 'password' }"
                  @click="passType = 'text'"
                />
                <img
                  src="@/assets/img/icon_password-eyes.svg"
                  alt="패스워드 아이즈 비활성화"
                  :class="{ active: passType === 'text' }"
                  @click="passType = 'password'"
                />
              </span>
            </div>
            <p
              style="margin-bottom: 0"
              :class="{ help_txt, error_box: userPass }"
              v-html="userPassErrMsg"
            ></p>
          </div>

          <button
            style="color: white; height: 52px"
            type="submit"
            :class="{
              btn_black,
            }"
            @click="submit"
          >
            로그인
          </button>
          <!--  -->
          <div class="user_active">
            <p @click="goRegister">회원가입</p>
            <p @click="goSetPass">비밀번호 찾기</p>
          </div>
          <div>
            <h3 class="sns_title">SNS 간편 로그인</h3>
            <div class="sns_btn">
              <!--  -->
              <div @click="redirect('kakao')">
                <!-- <img src="@/assets/img/kakao_icon.svg" alt="" /> -->
              </div>
              <div @click="redirect('naver')">
                <!-- <img src="@/assets/img/naver_icon.svg" alt="" /> -->
              </div>
              <div @click="redirect('google')">
                <!-- <img src="@/assets/img/google_icon.svg" alt="" /> -->
              </div>
              <div @click="redirect('apple')">
                <!-- <img src="@/assets/img/apple_icon.svg" alt="" /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="footer_wrap">
      <p>©Jeongeum. All Rights Reserved.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSessionStore } from "@/store/session";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const { user, login } = useSessionStore();
const $router = useRouter();

const email = ref<string>("");
const password = ref<string>("");
const passType = ref<string>("password");

//오류
const userPass = ref<boolean>(false);
const userId = ref<boolean>(false);
const activeLogin = ref<boolean>(false);

const input_common_style = ref<boolean>(true);
const btn_black = ref<boolean>(true);
const help_txt = ref<boolean>(true);

const userErrMsg = ref<string>("");
const userPassErrMsg = ref<string>("");

watch(email, (v) => {
  if (v !== "") {
    userId.value = false;
    userErrMsg.value = "";
  } else {
    userId.value = true;
    userErrMsg.value = "아이디를 입력해주세요";
  }
});

watch(password, (v) => {
  if (v !== "") {
    userPass.value = false;
    userPassErrMsg.value = "";
  } else {
    userPass.value = true;
    userPassErrMsg.value = "비밀번호를 입력해주세요";
  }
});

const redirect = (type: string) => {
  $router.push({ name: "SNS", query: { type: type } });
};
const goHome = () => {
  // this.$router.replace({ path: "/" });
  location.href = "/";
};
const goRegister = () => {
  // this.$router.replace({ path: "/register" });
  location.href = "/register";
};
const goSetPass = () => {
  // this.$router.replace({ path: "/password" });
  location.href = "/password";
};
const submit = async () => {
  if (!email.value || !password.value) return;
  // let user = {
  //   email: this.email,
  //   password: this.password,
  // };

  await login({
    id: email.value,
    pwd: password.value,
  });
};

if (localStorage.t_access_token || !!user) {
  $router.push({ name: "monitoring" });
}
</script>
<style lang="css" scoped>
/* @import url("@/assets/css/common.css");
@import url("@/assets/css/media.css"); */
.activeLogin {
  pointer-events: none;
  background: rgb(17, 17, 17, 0.2);
  color: #111;
}
.help_txt {
  color: #ff004b;
  display: none;
  font-size: 14px;
}
.help_txt.error_box {
  display: block;
}
.error_box.input_common_style {
  border: solid 1px #f73287;
  box-sizing: border-box;
}
.error_box:focus {
  border: solid 1px #f73287;
  box-sizing: border-box;
}

/* 사용자액션 */
.user_active {
  margin: 0 auto;
  display: flex;
  text-align: center;
  margin-top: 20px;
  position: relative;
  width: 100%;
  justify-content: center;
  margin-bottom: 40px;
}
.user_active p {
  font-size: 14px;
  color: #111;
  font-weight: bold;
  position: relative;
  padding: 0 24px;
  margin-bottom: 44px;
  cursor: pointer;
}
.user_active p:first-child::after {
  content: "";
  height: 12px;
  width: 1px;
  background-color: #e4e9f0;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.user_active::after {
  width: 100%;
  height: 1px;
  background-color: #e4e9f0;
  content: "";
  position: absolute;
  bottom: 0;
}
.sns_title {
  font-size: 18px;
  font-weight: bold;
  color: #111;
  text-align: center;
  margin-bottom: 20px;
}
.sns_btn {
  display: flex;
  justify-content: center;
}
.sns_btn > div {
  border: solid 1px #e4e9f0;
  border-radius: 50%;
  padding: 18px;
  margin-right: 24px;
  cursor: pointer;
}
@media screen and (max-width: 500px) {
  .sns_btn > div {
    width: 56px;
    height: 56px;
    padding: 15px;
    margin-right: 12px;
    box-sizing: border-box;
    position: relative;
  }
  .sns_btn > div img {
    width: 24px;
    height: 24px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .sns_btn > div:last-child {
    margin-right: 0;
  }
}
.sns_btn > div:last-child {
  margin-right: 0;
}

.footer_wrap {
  padding: 24px 0;
  text-align: center;
}
.footer_wrap p {
  font-size: 14px;
  color: #acb2b9;
  margin-bottom: 0;
}
header {
  position: relative;
}
/* bi 추가 */
@media screen and (max-width: 1023px) {
  header {
    background-color: unset;
    left: unset;
    height: 80px;
  }
  .container-header {
    padding: 0;
    z-index: -1;
    height: 80px;
    background-color: unset;
  }
  .header-title {
    padding-top: 40px;
  }
  .login_form-container {
    border-radius: 20px;
  }
  .white_box {
    border-radius: 20px;
  }
}
@media screen and (max-width: 767px) {
  .login_form-container {
    padding: 20px 20px;
    border-radius: 20px;
  }
  .login_form-login h2 {
    display: none;
  }
  .login_form-login {
    height: 525px;
  }
  .user_active p {
    margin-bottom: 30px;
  }
  .user_active {
    margin-bottom: 20px;
  }
}
.wrap {
  padding-bottom: 0 !important;
}
</style>
