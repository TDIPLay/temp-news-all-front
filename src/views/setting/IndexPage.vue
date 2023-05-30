<template>
  <div class="home">
    <MainLayout @content-scroll="infiniteScrolling" :footer-hide="true">
      <PageHeader>
        <template #title>
          <div class="row m-0">
            <div class="col">
              <span class="fw-bolder font-size-18"> </span>
            </div>
          </div>
        </template>
      </PageHeader>

      <div class="row m-0 mt-4 text-start justify-content-center">
        <div class="col">
          <ul class="nav nav-pills nav-justified" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{
                  active: tabIdx == 1,
                }"
                data-bs-toggle="tab"
                data-bs-target="#tab_user_info"
                role="tab"
                aria-controls="tab_user_info"
                :aria-selected="tabIdx == 1"
                @click="tabIdx = 1"
              >
                <span class=" ">계정 정보</span>
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{
                  active: tabIdx == 2,
                }"
                data-bs-toggle="tab"
                data-bs-target="#tab_alarm"
                role="tab"
                aria-controls="tab_alarm"
                :aria-selected="tabIdx == 2"
                @click="tabIdx = 2"
              >
                <span class=""> 알림 설정</span>
              </button>
            </li>
          </ul>

          <div class="card tab-content p-3 text-muted">
            <div
              id="tab_user_info"
              class="tab-pane border-0 card-body"
              :class="{
                'active show': tabIdx == 1,
                fade: tabIdx != 1,
              }"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <UserInfoTab v-if="userInfo" :userInfo="userInfo" />
            </div>
            <div
              id="tab_alarm"
              class="tab-pane card-body px-1 px-sm-3"
              :class="{
                'active show': tabIdx == 2,
                fade: tabIdx != 2,
              }"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div class="d-flex border-bottom">
                <div class="card-title col me-3">
                  <div class="fw-bolder">
                    <i class="mdi mdi-bell-outline me-1"></i>
                    카카오 알림
                  </div>
                  <div class="font-size-13 ps-3">
                    실시간으로 새로운 뉴스 알림을 보내 드립니다.
                  </div>
                </div>

                <div class="col-auto">
                  <button
                    class="btn btn-outline-primary px-4"
                    :class="{
                      active: !!userAlarmInfo.kakao,
                      deactivate: !userAlarmInfo.kakao,
                    }"
                    @click="handleKakaoAlarmInfo()"
                  >
                    <i class="mdi mdi-bell-outline pe-1"></i>
                    <span class="d-none d-md-inline-block">알림받기</span>
                    {{ userAlarmInfo.kakao ? "ON" : "OFF" }}
                  </button>
                </div>
              </div>

              <AlarmInfoTab
                v-if="userAlarmInfo.kakao"
                :alarm-info="userAlarmInfo.kakao"
                :keywords-group-list="keywordsGroupList"
                @set-data="(data:any) => {
                  CommonUtils.updateVoByKey( userAlarmInfo.kakao, data);
                }"
                type="kakao"
              />
              <div class="d-flex border-bottom my-3">
                <div class="card-title col me-3">
                  <div class="fw-bolder">
                    <i class="mdi mdi-bell-outline me-1"></i>
                    이메일 알림
                  </div>
                  <div class="font-size-13 ps-3">
                    선택한 키워드에 새로운 뉴스가 등록되는 경우 이메일이
                    발송됩니다.
                  </div>
                </div>

                <div class="col-auto">
                  <button
                    class="btn btn-outline-primary px-4"
                    :class="{
                      active: !!userAlarmInfo.mail,
                      deactivate: !userAlarmInfo.mail,
                    }"
                    @click="handleMailAlarmInfo()"
                  >
                    <i class="mdi mdi-bell-outline pe-1"></i>
                    <span class="d-none d-md-inline-block">알림받기</span>
                    {{ userAlarmInfo.mail ? "ON" : "OFF" }}
                  </button>
                </div>
              </div>
              <AlarmInfoTab
                v-if="userAlarmInfo.mail"
                :alarm-info="userAlarmInfo.mail"
                :keywords-group-list="keywordsGroupList"
                @set-data="(data:any) => {
                  CommonUtils.updateVoByKey( userAlarmInfo.mail, data);
                }"
                type="mail"
              />

              <div class="submit-btn align-center d-flex my-4">
                <button
                  :class="`mx-auto btn btn-primary  px-4`"
                  type="button"
                  :disabled="!isUpdateUserAlarm"
                  @click="submitUserAlarmInfo()"
                >
                  정보 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";

import PageHeader from "@/components/layouts/page-header.vue";
import MainLayout from "@/layouts/MainLayout.vue";

import UserInfoTab from "@/components/setting/UserInfoTab.vue";
import AlarmInfoTab from "@/components/setting/AlarmInfoTab.vue";
import CommonTimePicker from "@/components/common/CommonTimePicker.vue";

import { useCommonStore } from "@/store/common";
import { CommonUtils } from "@/utils/CommonUtils";

import { KeywordAPI } from "@/api/keyword";
import { UserAPI } from "@/api/user";

import { KakaoAlarmInfo, MailAlarmInfo, UserInfo } from "@/models/User";
import { ScrapKeywordGroup } from "@/models/scrap";

const { showLoading, hideLoading, showNoti } = useCommonStore();
const route = useRoute();
const tabIdx = ref(route.query?.tabIdx ? Number(route.query?.tabIdx) : 1);
const userInfo = ref();
const userAlarmInfo = reactive<{
  kakao: KakaoAlarmInfo | null;
  mail: MailAlarmInfo | null;
}>({
  kakao: null,
  mail: null,
});

const keywordsGroupList = ref<ScrapKeywordGroup[]>([]);
const maxKeywordCount = 10;

const isUpdateUserAlarm = computed(() => {
  if (tabIdx.value !== 2) return false;
  return (
    (userAlarmInfo.kakao ? userAlarmInfo.kakao.isUpdate() : false) ||
    (userAlarmInfo.mail ? userAlarmInfo.mail.isUpdate() : false)
  );
});

/**@description: 키워드 그룹 목록 조회 */
const fetchKeywordGroupList = async (group_no?: string) => {
  keywordsGroupList.value = [];
  const response = await KeywordAPI.getKeyWordGroups();

  const { data } = response;

  if (data && data.length > 0) {
    keywordsGroupList.value = data.map(
      (item: any) => new ScrapKeywordGroup(item)
    );
  }
};

/**@description: 회원 알람 정보 조회 */
const fetchUserAlarmInfo = async () => {
  const response = await UserAPI.getUserAlarmInfo();

  const { alarm } = response.data;

  if (alarm) {
    userAlarmInfo.kakao = alarm.kakao ? new KakaoAlarmInfo(alarm.kakao) : null;
    userAlarmInfo.mail = alarm.mail ? new MailAlarmInfo(alarm.mail) : null;
  }
};

/**@description: 회원 정보 조회 */
const fetchUserInfo = async () => {
  showLoading();

  const response = await UserAPI.getUserInfo();

  const { user } = response.data;

  if (user) {
    userInfo.value = new UserInfo(user);
  }

  setTimeout(() => {
    hideLoading();
  }, 500);
};

/**@description: 카카오 알림받기 등록, 삭제시 */
const handleKakaoAlarmInfo = async () => {
  if (!userAlarmInfo.kakao) {
    // 등록 혹은 수정은 무조건 등록으로
    userAlarmInfo.kakao = new KakaoAlarmInfo();
    return;
  }

  let init = !userAlarmInfo.kakao.origin;

  if (!init) {
    // 기존에 있으면 삭제 알림 물어보고 삭제 ㄱ
    const res = await UserAPI.deleteUserAlarmInfo(
      userAlarmInfo.kakao.alarm_type
    );

    const { result, message } = res.data;
    init = result ? true : false;

    showNoti({
      message: message,
      type: result ? "" : "error",
    });
  }

  if (init) {
    userAlarmInfo.kakao = null;
  }
};

/**@description: 메일 알림받기 등록, 삭제시 */
const handleMailAlarmInfo = async () => {
  if (!userAlarmInfo.mail) {
    // 등록 혹은 수정은 무조건 등록으로
    userAlarmInfo.mail = new MailAlarmInfo();
    return;
  }

  let init = !userAlarmInfo.mail.origin;

  if (!init) {
    // 기존에 있으면 삭제 알림 물어보고 삭제 ㄱ
    const res = await UserAPI.deleteUserAlarmInfo(
      userAlarmInfo.mail.alarm_type
    );

    const { result, message } = res.data;
    init = result ? true : false;
    showNoti({
      message: message,
      type: result ? "" : "error",
    });
  }

  if (init) {
    userAlarmInfo.mail = null;
  }
};

/**@description: 알람 정보 저장 */
const submitUserAlarmInfo = async () => {
  const temp = [];
  showLoading();
  let errMsg = "";
  if (
    userAlarmInfo.mail &&
    ((await userAlarmInfo.mail.isUpdate()) || !userAlarmInfo.mail.origin)
  ) {
    errMsg = await userAlarmInfo.mail.vaild();

    // 메일 수정 사항 있는경우
    if (!errMsg) {
      temp.push(() =>
        UserAPI.createUserAlarmInfo(userAlarmInfo.mail?.saveDataFormat())
      );
    }
  }

  if (
    userAlarmInfo.kakao &&
    ((await userAlarmInfo.kakao.isUpdate()) || !userAlarmInfo.kakao.origin)
  ) {
    // 카카오 수정 사항 있는경우
    errMsg = await userAlarmInfo.kakao.vaild();
    if (!errMsg) {
      temp.push(() =>
        UserAPI.createUserAlarmInfo(userAlarmInfo.kakao?.saveDataFormat())
      );
    }
  }

  // 에러메세지 있는 경우
  if (errMsg || !temp.length) {
    hideLoading();

    if (!errMsg) return;
    showNoti({
      message: errMsg,
      type: "error",
    });
    return;
  }

  let response = temp.reduce((acc, api) => {
    api().then((res: any) => {
      const { result, message } = res.data;
      if (!result) {
        acc = message;
      }
    });
    return acc;
  }, "");

  setTimeout(() => {
    hideLoading();
    if (!response) {
      fetchUserAlarmInfo();
    }
    showNoti({
      message: response ? response : "알람 설정이 저장 되었습니다.",
      type: response ? "error" : "",
    });
  }, 1000);
};

/**@description: 작은 배열 기준으로 교집합 */
const intersectionList = (groupIdList: string[], selectedList: string[]) => {
  return selectedList.length > groupIdList.length
    ? groupIdList.filter((x) => selectedList.includes(x))
    : selectedList.filter((x) => groupIdList.includes(x));
};

Promise.all([fetchUserInfo(), fetchUserAlarmInfo(), fetchKeywordGroupList()]);
</script>
<style lang="scss" scoped>
.border-bottom {
  border-width: 2px !important;
}
</style>
