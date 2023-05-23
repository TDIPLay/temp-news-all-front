<template>
  <div class="account-pages my-5 pt-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6 col-xl-5">
          <div class="card overflow-hidden">
            <div class="bg-soft bg-primary">
              <div class="row">
                <div class="col-7">
                  <div class="text-primary p-4 text-start">
                    <h5 class="text-primary">Welcome Back !</h5>
                    <p>Sign in to continue to Skote.</p>
                  </div>
                </div>
                <div class="col-5 align-self-end">
                  <!-- <img
                    src="@/assets/images/logo/main_logo_header.png"
                    alt
                    class="img-fluid"
                  /> -->
                </div>
              </div>
            </div>
            <div class="card-body pt-0">
              <div>
                <router-link to="/">
                  <div class="avatar-md profile-user-wid mb-4">
                    <span
                      class="avatar-title rounded-circle bg-white"
                      style="border: 1px solid rgba(85, 110, 230, 0.25)"
                    >
                      <img
                        src="@/assets/images/logo/main_logo_header.png"
                        alt
                        height="34"
                      />
                    </span>
                  </div>
                </router-link>
              </div>

              <b-alert
                v-model="isAuthError"
                variant="danger"
                class="mt-3"
                dismissible
                >{{ authError }}</b-alert
              >

              <b-form class="p-2 text-start" action="javascript:void(0)">
                <slot />
                <b-form-group
                  id="input-group-1"
                  label="아이디"
                  label-for="input-1"
                  class="mb-3"
                >
                  <b-form-input
                    id="input-1"
                    name="email"
                    v-model="email"
                    type="text"
                    placeholder="아이디를 입력해 주세요."
                    @keydown.enter="submit"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  id="input-group-2"
                  label="비밀번호"
                  label-for="input-2"
                  class="mb-3 position-relative"
                >
                  <div class="row m-0 align-items-center">
                    <b-form-input
                      id="input-2"
                      v-model="password"
                      name="password"
                      :type="passType"
                      placeholder="비밀번호를 입력해 주세요."
                      class="col"
                    >
                    </b-form-input>
                    <span class="icon_password-btn col-auto">
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
                        @keydown.enter="submit"
                      />
                    </span>
                  </div>
                </b-form-group>
                <div class="mt-3 d-grid">
                  <button
                    type="submit"
                    :disabled="loading"
                    @click="submit"
                    class="btn btn-primary btn-block"
                  >
                    로그인
                  </button>
                </div>

                <div class="mt-4 text-center">
                  <h5 class="font-size-14 mb-3">SNS 간편 로그인</h5>
                  <div class="sns_btn">
                    <!--  -->
                    <div @click="redirect('kakao')">
                      <img src="@/assets/img/kakao_icon.svg" alt="" />
                    </div>
                    <div @click="redirect('naver')">
                      <img src="@/assets/img/naver_icon.svg" alt="" />
                    </div>
                    <div @click="redirect('google')">
                      <img src="@/assets/img/google_icon.svg" alt="" />
                    </div>
                    <!-- <div @click="redirect('apple')">
                <img src="@/assets/img/apple_icon.svg" alt="" />
              </div> -->
                  </div>
                </div>
                <!-- <div class="mt-4 text-center">
                  <router-link to="/forget-password" class="text-muted">
                    <i class="mdi mdi-lock mr-1"></i> Forgot your password?
                  </router-link>
                </div> -->
              </b-form>
            </div>
            <!-- end card-body -->
          </div>
          <!-- end card -->

          <div class="mt-5 text-center">
            <p>
              Don't have an account ?
              <a
                @click="goRegister"
                class="fw-medium text-primary"
                href="javascript:void(0)"
              >
                Signup now
              </a>
            </p>
            <p>© 2023 ©Jeongeum. Crafted</p>
          </div>
          <!-- end row -->
        </div>
        <!-- end col -->
      </div>
      <!-- end row -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

import { useSessionStore } from "@/store/session";
import { useCommonStore } from "@/store/common";

const { showNoti } = useCommonStore();
const { user, login } = useSessionStore();
const router = useRouter();

const email = ref<string>("");
const password = ref<string>("");
const passType = ref<string>("password");

//오류
const userPass = ref<boolean>(false);
const userId = ref<boolean>(false);
const input_common_style = ref<boolean>(true);
const btn_black = ref<boolean>(true);
const help_txt = ref<boolean>(true);
const userErrMsg = ref<string>("");
const userPassErrMsg = ref<string>("");

watch(email, (v: string) => {
  userId.value = !!v;
  userErrMsg.value = !v ? "아이디를 입력해주세요" : "";
});

watch(password, (v: string) => {
  userPassErrMsg.value = "";
  userPassErrMsg.value = !v ? "비밀번호를 입력해주세요" : "";
});

const redirect = (type: string) => {
  router.push({ name: "SNS", query: { type: type } });
};
const goHome = () => {
  router.replace({ name: "main" });
};
const goRegister = () => {
  location.href = "/register";
};
const submit = async () => {
  if (!email.value || !password.value) {
    showNoti({
      message: "입력항목을 확인해 주세요.",
    });
    return;
  }
  // let user = {
  //   email: this.email,
  //   password: this.password,
  // };

  await login({
    id: email.value,
    pwd: password.value,
  }).then((res) => {
    showNoti({
      message: res.message,
    });

    if (res.result) {
      router.push({ name: "monitoring" });
    }
  });
};

if (user) {
  router.push({ name: "monitoring" });
}
</script>
<style lang="scss" scoped>
.sns_btn {
  display: flex;
  justify-content: center;

  div {
    border: solid 1px #e4e9f0;
    border-radius: 50%;
    padding: 8px;
    margin-right: 24px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    img {
      width: 100%;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.icon_password-btn {
  z-index: 9;
  position: absolute;
  right: 0;
  cursor: pointer;
}
.icon_password-btn img {
  display: none;
}
.icon_password-btn img.active {
  display: block;
}
.login_form-container button {
  margin: 20px 0 0;
}
</style>
