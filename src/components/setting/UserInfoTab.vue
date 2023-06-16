<template>
  <div class="py-0 mx-1 mb-4" style="background: #fff">
    <div class="card-title-index card-title text-start">기본 정보</div>

    <div
      class="p-2 p-sm-3 p-md-4 py-0 pt-sm-1 pt-md-2"
      style="max-width: 600px"
    >
      <div
        class="py-0 col mt-3 d-flex flex-column flex-md-row align-items-start align-items-md-center"
      >
        <h4 class="card-title col-auto my-0 me-4">아이디</h4>
        <h4 class="card-title my-0" style="padding: 0.47rem 0.75rem">
          {{ curUserInfo.account_id }}
        </h4>
      </div>
      <div
        class="py-0 col mt-3 d-flex flex-column flex-md-row align-items-start align-items-md-center"
      >
        <h4 class="card-title col-auto my-0 me-4">닉네임</h4>
        <input
          autocomplete="off"
          type="text"
          class="form-control"
          v-model="curUserInfo.name"
          placeholder="이름을 입력하세요."
        />
      </div>

      <div
        class="py-0 col mt-3 d-flex flex-column flex-md-row align-items-start align-items-md-center"
      >
        <h4 class="card-title col-auto my-0 me-4">회사명</h4>
        <input
          autocomplete="off"
          type="text"
          class="form-control"
          v-model="curUserInfo.account_company"
          placeholder="회사명을 입력하세요."
        />
      </div>
      <div
        class="py-0 col mt-3 d-flex flex-column flex-md-row align-items-start align-items-md-center"
      >
        <h4 class="card-title col-auto my-0 me-4">연락처</h4>
        <input
          autocomplete="off"
          type="text"
          class="form-control"
          v-model="curUserInfo.phone_number"
          placeholder="010-0000-0000"
        />
      </div>

      <div class="py-0 col mt-3 ps-3 d-flex flex-row align-center">
        <h4 class="card-title col-auto my-0 me-4">알림</h4>

        <div class="d-flex">
          <div
            class="card-title form-check form-checkbox-outline form-check-primary mb-3 col"
          >
            <input
              class="form-check-input"
              type="checkbox"
              id="form-check-mailing"
              v-model="curUserInfo.mailing"
              :class="{ active: !curUserInfo.mailing }"
            />
            <label
              class="form-check-label font-size-13"
              for="form-check-mailing"
            >
              마케팅, 이벤트 등 프로모션 알림 메일을 수신합니다.
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="card-title-index card-title text-start">결제 정보</div>
    <div
      class="p-2 p-sm-3 p-md-4 py-0 pt-sm-1 pt-md-2"
      style="max-width: 600px"
    >
      <div
        class="py-0 col mt-3 d-flex flex-column flex-md-row align-items-start align-items-md-center"
      >
        <h4 class="card-title col-auto my-0 me-4">플랜</h4>
        <h4 class="card-title my-0" style="padding: 0.47rem 0.75rem">
          <template v-if="!isPaiyed">
            <span class="badge badge-soft-primary font-size-13 px-2">
              {{ planType }}
            </span>

            <button
              class="btn btn-outline-primary ms-3 py-1"
              @click="showSubscriptionModal = true"
            >
              유료 구독
            </button>
          </template>
          <template v-else> </template>
        </h4>
      </div>
    </div> -->
  </div>
  <div class="submit-btn align-center d-flex">
    <button
      class="btn btn-dark px-4 mx-auto"
      type="button"
      @click="submitUserInfo()"
    >
      정보 저장
    </button>

    <SubscriptionModal v-if="showSubscriptionModal" />
  </div>
</template>

<script setup lang="ts">
import { UserAPI } from "@/api/user";
import { UserInfo } from "@/models/User";
import { useCommonStore } from "@/store/common";
import { useSessionStore } from "@/store/session";
import { ref, computed } from "vue";
import SubscriptionModal from "./SubscriptionModal.vue";
const { showLoading, hideLoading, showNoti } = useCommonStore();
const { user, setUserInfo } = useSessionStore();

const props = defineProps({
  userInfo: {
    type: UserInfo,
    default: new UserInfo(),
  },
});
const curUserInfo = ref<UserInfo>();
const isPaiyed = ref(false);
const planType = computed(() => {
  return isPaiyed.value ? "스탠다드" : "무료 버전";
});
const showSubscriptionModal = ref(false);

if (props.userInfo) {
  curUserInfo.value = new UserInfo(props.userInfo);
}

/**@description: 회원 정보 수정 */
const submitUserInfo = async () => {
  if (!curUserInfo.value) return;

  curUserInfo.value.vaild();

  const errMsg = curUserInfo.value.vaild();
  if (errMsg) {
    showNoti({
      message: errMsg,
      type: "error",
    });

    return;
  }

  showLoading();
  const { data } = await UserAPI.updateUserInfo(
    curUserInfo.value.saveDataFormat()
  );

  setTimeout(() => {
    hideLoading();

    if (data) {
      if (data.result) {
        curUserInfo.value = new UserInfo(curUserInfo.value);
        console.log(user.name);
        if (curUserInfo.value.name !== user.name) {
          setUserInfo({
            ...user,
            name: curUserInfo.value.name,
          });
        }
      }

      showNoti({
        message: data?.message,
        type: data.result > 0 ? "info" : "error",
      });
    }
  }, 1000);
};

if (props.userInfo) {
  curUserInfo.value = new UserInfo({ ...props.userInfo });
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
