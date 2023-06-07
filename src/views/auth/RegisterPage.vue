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
                    <h5 class="text-primary">
                      {{ !isComplated ? "Welcome !" : "가입을 축하합니다." }}
                    </h5>
                    <p>Sign in to continue to Jeongeum.</p>
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

            <div class="card-body pt-0" v-if="!isComplated">
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
              <div
                v-if="isAuthError"
                class="mt-3 alert alert-danger font-size-14 alert-dismissible text-start"
                role="alert"
              >
                <i class="mdi mdi-information-outline font-size-14"></i>
                {{ authError }}
              </div>

              <b-form class="p-2 text-start" :action="submit">
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
                    type="email"
                    v-model="formData.account_id"
                    placeholder="사용하실 이메일을 입력하세요."
                    @keydown.enter="submit"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  id="input-group-4"
                  label="닉네임"
                  label-for="input-4"
                  class="mb-3"
                >
                  <b-form-input
                    id="input-4"
                    name="nick"
                    type="text"
                    v-model="formData.name"
                    placeholder="사용하실 닉네임을 입력하세요."
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
                      v-model="formData.account_pw"
                      name="password"
                      type="password"
                      placeholder="비밀번호를 입력해 주세요."
                      class="col"
                    >
                    </b-form-input>
                  </div>
                </b-form-group>

                <b-form-group
                  id="input-group-3"
                  label="비밀번호 확인"
                  label-for="input-3"
                  class="mb-3 position-relative"
                >
                  <div class="row m-0 align-items-center">
                    <b-form-input
                      id="input-3"
                      v-model="formData.account_pw_cf"
                      name="account_pw_cf"
                      type="password"
                      placeholder="비밀번호를 확인해 주세요."
                      class="col"
                    >
                    </b-form-input>
                  </div>
                </b-form-group>

                <b-form-group
                  id="input-group-5"
                  label="회사명"
                  label-for="input-5"
                  class="mb-3"
                >
                  <b-form-input
                    id="input-5"
                    name="account_company"
                    :required="false"
                    v-model="formData.account_company"
                    type="text"
                    placeholder="회사명을 입력하세요."
                    @keydown.enter="submit"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  id="input-group-6"
                  label="연락처"
                  label-for="input-6"
                  class="mb-3"
                >
                  <b-form-input
                    id="input-6"
                    name="phone_number"
                    v-model="formData.phone_number"
                    type="phone"
                    placeholder="문의 시 답변받을 연락처를 입력하세요."
                    @keydown.enter="submit"
                  ></b-form-input>
                </b-form-group>
              </b-form>

              <div class="check_box_wrap">
                <div class="all">
                  <div
                    class="form-check form-checkbox-outline form-check-primary mb-3"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="selectAll"
                      :class="{ active: selectAll === true }"
                    />
                    <label class="form-check-label" @click="checkselectAll">
                      모두 동의합니다.
                    </label>
                  </div>
                </div>
              </div>
              <div class="another">
                <div
                  class="d-flex"
                  v-for="(item, index) in checkList"
                  :key="index"
                >
                  <div
                    class="form-check form-checkbox-outline form-check-primary mb-3 col"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="item.select"
                      :class="{ active: item.select === true }"
                    />
                    <label class="form-check-label" @click="check(index)">
                      <span class="text-danger font-size-11"> (필수)</span>
                      {{ item.text }}
                    </label>
                  </div>
                  <button
                    class="btn btn-outline-primary col-auto py-0 px-2 font-size-11"
                    style="height: 24px"
                    type="button"
                    @click="modalActive(item.text)"
                  >
                    보기
                  </button>
                </div>
              </div>
              <div class="mt-3 d-grid">
                <button
                  type="submit"
                  :disabled="loading"
                  @click="submit"
                  class="btn btn-primary btn-block"
                >
                  회원가입
                </button>
              </div>
            </div>
            <div class="card-body pt-0" v-else>
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
                <div class="p-2 pt-0">
                  <div class="text-center">
                    <div class="avatar-md mx-auto">
                      <div class="avatar-title rounded-circle bg-light">
                        <i
                          class="mdi mdi-party-popper h1 mb-0 text-primary"
                        ></i>
                      </div>
                    </div>
                    <div class="p-2 mt-4">
                      <h4>회원가입 완료</h4>
                      <p class="text-muted">
                        회원 가입을 축하합니다.<br />
                        로그인 후 정음의 다양한 기능을 이용해 보세요.
                      </p>
                      <div class="mt-4">
                        <button
                          type="submit"
                          :disabled="loading"
                          @click="goLogin"
                          class="btn btn-primary btn-block px-5"
                        >
                          로그인
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end card-body -->
          </div>
          <!-- end card -->

          <!-- end row -->
        </div>
        <!-- end col -->
      </div>
      <!-- end row -->
    </div>

    <div class="mt-5 text-center">
      <p>
        Do have an account?
        <a
          @click="goLogin"
          class="fw-medium text-primary"
          href="javascript:void(0)"
        >
          Login now
        </a>
      </p>
      <p>© 2023 ©Jeongeum. Crafted</p>
    </div>
    <ServicePolicyModal
      @close-modal="closeModal"
      :modal="modal"
      :modalText="modalText"
    />
  </div>
</template>
<script setup lang="ts">
import ServicePolicyModal from "@/components/auth/ServicePolicyModal.vue";

import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { CommonUtils } from "@/utils/CommonUtils";
import { useCommonStore } from "@/store/common";
import { RegisterUser } from "@/models/User";
import { UserAPI } from "@/api/user";
import { useSessionStore } from "@/store/session";
import { KeywordAPI } from "@/api/keyword";
import { computed } from "@vue/reactivity";
const { login, logout } = useSessionStore();
const { loading, showLoading, hideLoading, showNoti } = useCommonStore();
const formData = ref(new RegisterUser());

const screenHeight = ref(0);
const modal = ref(false);
const modalText = ref("");
const isComplated = ref(false);
const selectAll = ref(false);
const authError = ref("");
const isAuthError = computed(() => !!authError.value);

const checkList = ref([
  {
    text: "서비스 이용약관",
    select: false,
  },
  {
    text: "개인정보수집 및 이용안내",
    select: false,
  },
]);
watch([...checkList.value], (v) => {
  const falseList = v.filter(function (el) {
    if (el.select === false) {
      return true;
    }
  });

  if (falseList.length > 0 || v.length === 0) {
    selectAll.value = false;
  } else {
    selectAll.value = true;
  }
});

const checkselectAll = () => {
  if (selectAll.value === true) {
    checkList.value.map((item) => {
      item.select = false;
    });
  } else {
    checkList.value.map((item) => {
      item.select = true;
    });
  }

  selectAll.value != selectAll.value;
};
const goHome = () => {
  location.href = "/";
};
const onResize = () => {
  screenHeight.value = window.innerHeight;
};

const submit = async () => {
  authError.value = "";
  const errMsg = await formData.value.vaild();
  if (errMsg) {
    authError.value = "필수항목의 체크가 필요합니다.";
    return;
  }

  if (selectAll.value === false) {
    authError.value = "필수약관 동의가 필요합니다.";
    return;
  }

  showLoading();

  const { data } = await UserAPI.register(formData.value.saveDataFormat());
  // console.log("회원가입  ", data);

  if (data?.result) {
    // ----TODO:회사명으로 스크랩 잠시 보류 ----------------------
    // if (formData.value.account_company) {
    //   // 로그인
    //   const loginRes = await login({
    //     id: formData.value.account_id,
    //     pwd: formData.value.account_pw,
    //   });
    //   if (loginRes.result) {
    //     // 키워드 그룹 및 키워드 등록
    //     await keywordGroupRegist(formData.value.account_company);
    //   } else {
    //     console.log("회원가입-로그인 오류", loginRes);
    //   }
    // }
  }

  setTimeout(() => {
    showNoti({
      message: data?.message,
      type: data?.result > 0 ? "info" : "error",
    });

    if (data?.result) {
      formData.value = new RegisterUser();
      isComplated.value = true;
    }

    hideLoading();
  }, 1000);
};
// 기본 키워드 그룹 등록
const keywordGroupRegist = async (keywordGroupTitle: string) => {
  const resGroup = await KeywordAPI.createKeyWordGroup({
    division: "regist",
    group_name: keywordGroupTitle,
  });

  const { result, group_no, message } = resGroup.data;

  if (result) {
    if (group_no) {
      await keywordRegist(keywordGroupTitle, group_no);
    } else {
      logout();
    }
  } else {
    console.log("회원가입-기본 키워드 그룹 등록 Error", message);
    logout();
  }
};

// 기본 키워드 등록
const keywordRegist = async (keyword: string, group_no: string) => {
  const resKeyword = await KeywordAPI.createKeyWord(keyword, group_no);
  const { result, message } = resKeyword.data;

  if (result) {
    await KeywordAPI.scrapKeyWord(keyword);
  } else {
    console.log("회원가입-기본 키워드 등록 Error", message);
  }

  logout();
};

const check = (index: number) => {
  if (checkList.value[index].select === true) {
    checkList.value[index].select = false;
  } else {
    checkList.value[index].select = true;
  }
};

const modalActive = (v: string) => {
  modal.value = true;
  modalText.value = v;
};

const goLogin = async () => {
  let active = await CommonUtils.AppUtility("login");

  if (!active) {
    location.href = "/login";
  }
};

const closeModal = () => {
  modal.value = false;
};

onMounted(() => {
  nextTick(() => {
    screenHeight.value = window.innerHeight;
    window.addEventListener("resize", onResize);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});
</script>
<style lang="css" scope>
button.disabledAll {
  pointer-events: none;
  opacity: 0.3;
}
button.disabled {
  pointer-events: none;
  opacity: 0.3;
}
img {
  vertical-align: center;
}
.help_txt {
  color: #ff004b;
  display: none;
  font-size: 14px;
}
.help_txt.error_box {
  display: block;
}

.submit_item input.err {
  border: solid 1px #f73287;
  background-color: #fff1f7;
}
</style>
