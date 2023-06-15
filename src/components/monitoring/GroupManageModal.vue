<template>
  <b-modal
    v-model="showModal"
    size="lg"
    centered
    title="키워드 그룹 설정"
    hide-footer
    @close="emit('close')"
    no-close-on-esc
    no-close-on-backdrop
    body-class="p-0"
  >
    <div class="card-body py-0">
      <div
        class="d-column d-lg-flex"
        style="max-height: 80vh; overflow-y: auto"
        ref="groupInfoEl"
      >
        <div
          class="col col-lg-5 py-3 border-bottom-lg-0 border-right-lg-2"
          style="border-right: solid #eff2f7; border-bottom: 2px solid #eff2f7"
        >
          <div class="card-title col-auto col-sm-12 text-start px-3 mb-3">
            키워드 그룹리스트
          </div>

          <div
            class="font-size-13 fw-bold d-flex align-items-center text-start px-1 py-2"
            :class="{
              'text-primary': !groupInfo?.group_no || groupInfo?.group_no < 0,
            }"
            @click.stop="handleGroupInfoSelect(null)"
          >
            <i class="mdi mdi-plus-box font-size-18 mx-2"></i>
            키워드 그룹 추가
          </div>

          <ul
            class="group_manage_modal px-0"
            style="max-height: 40vh"
            v-if="!options.groupList.length"
          >
            <li
              v-for="(group, gIdx) in options.groupList"
              :key="gIdx"
              class="row align-items-center m-0 py-1"
              :class="{
                'bg-body': gIdx % 2 == 0,
                active: group.group_no == groupInfo?.group_no,
              }"
              @click.stop="handleGroupInfoSelect(group.group_no)"
            >
              <div class="col-auto">
                <i
                  class="mdi font-size-18"
                  :class="{
                    'mdi-checkbox-marked-outline':
                      group.group_no == groupInfo?.group_no,
                    'mdi-checkbox-blank-outline':
                      group.group_no != groupInfo?.group_no,
                  }"
                ></i>
              </div>
              <div class="col ps-0 overflow-text fw-bold">
                {{ group.group_name }}
                <span class="font-size-11 fw-light">
                  ({{ group.keyword_list?.length || 0 }})
                </span>
              </div>
              <div class="col-auto">
                <button
                  type="button"
                  class="btn font-size-20 text-danger px-1 py-0"
                  @click.stop="keywordGroupDelete(group.group_no)"
                >
                  <i class="bx bx bx-trash-alt"></i>
                </button>
              </div>
            </li>
          </ul>

          <div
            v-else
            class="row justify-content-center align-items-center m-0"
            style="height: 300px"
          >
            <h4 class="card-title col-auto text-center">
              <i class="mdi mdi-alert-outline mx-2 font-size-25"></i>
              <div class="pt-2 font-size-13">
                키워드 그룹이 존재하지 않습니다.
              </div>
            </h4>
          </div>
        </div>

        <div class="col col-lg-7 p-3 d-flex flex-column" ref="groupInfoInputEl">
          <div class="card-title col-auto col-sm-12 text-start">
            {{
              groupInfo?.group_no && Number(groupInfo.group_no) > 0
                ? "키워드 그룹 수정"
                : "신규 키워드 그룹 추가"
            }}
          </div>

          <!-- 키워드 그룹 추가 -->
          <div class="font-size-13 col-auto col-sm-12 text-start mt-3">
            키워드 그룹명
          </div>

          <div class="col-auto mb-3">
            <input
              v-model="groupInfo.group_name"
              maxlength="20"
              placeholder="키워드 그룹명을 입력해주세요."
              class="form-control font-size-12"
            />
          </div>

          <div class="col-auto col-sm-12 mt-3" v-if="groupItems.length">
            <div class="font-size-13 text-start">
              등록한 키워드
              <span class="font-size-11"> ({{ groupItems.length }}) </span>
            </div>

            <div class="pb-3">
              <span
                v-for="(item, index) in groupItems"
                :key="index"
                class="col-auto badge font-size-13 badge-soft-secondary me-2 mt-1"
              >
                #{{ item.keyword }}
                <i
                  class="bx bx-x-circle"
                  style="margin-left: 4px"
                  @click="removeKeyword(item.keyword_no)"
                ></i>
              </span>
            </div>
          </div>

          <div class="col-auto col-sm-12 mt-3">
            <div class="font-size-13 text-start">
              등록할 키워드
              <span class="font-size-11">
                ({{ newKeywords.length }} /
                {{ MAX_LENGTH - groupItems.length }})
              </span>
            </div>

            <div class="input_tag-wrap">
              <div class="tag_register col">
                <input
                  v-model="inputKeyword"
                  @keydown.tab="({ target }:Event) => setKeyword(getElValue(target))"
                  @focusout="({ target }:Event) => setKeyword(getElValue(target))"
                  @keydown.enter="({ target }:Event) => setKeyword(getElValue(target))"
                  type="search"
                  autocomplete="off"
                  maxlength="20"
                  class="form-control font-size-12"
                  placeholder="키워드를 입력해주세요."
                />
              </div>
            </div>

            <div
              class="row justify-content-start pa-0 pb-1 g-1 m-0"
              v-if="newKeywords.length"
            >
              <span
                v-for="(item, kIdx) in newKeywords"
                :key="kIdx"
                class="col-auto badge font-size-13 badge-soft-secondary me-2 mt-1"
              >
                {{ item }}
                <i
                  class="bx bx-x-circle"
                  style="margin-left: 4px"
                  @click="removeItem(kIdx)"
                ></i>
              </span>
            </div>
          </div>

          <div
            class="d-flex m-0 justify-content-center p-3 align-items-end"
            style="flex: 10000 1 0%"
          >
            <div class="col-auto">
              <button
                class="btn btn-outline-secondary px-4 me-2"
                :class="{ disabled: loading }"
                @click="emit('close')"
              >
                취소
              </button>
              <button
                class="btn btn-dark px-4 ms-2"
                :class="{ disabled: loading }"
                @click="submit"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from "vue";
import Swal from "sweetalert2";

import { ScrapKeywordGroup, ScrapKeyword } from "@/models/scrap";
import { KeywordAPI } from "@/api/keyword";
import { useCommonStore } from "@/store/common";

const openDialog = true;
const { loading, showLoading, hideLoading } = useCommonStore();
const { showNoti } = useCommonStore();
const groupInfoEl = ref(null);
const groupInfoInputEl = ref(null);
const props = defineProps({
  id: {
    type: String || Number,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "close", value?: any): void;
  (e: "refresh", value?: any): void;
  (e: "refresh-group", value?: any): void;
}>();

const options = reactive<{
  groupList: any[];
}>({
  groupList: [],
});

const showModal = ref(false);
// 그룹 정보
const groupInfo = ref<ScrapKeywordGroup>(new ScrapKeywordGroup());
const groupItems = ref<ScrapKeyword[]>([]); // 키워드 그룹에 속한 키워드

const newKeywords = ref<string[]>([]);
const inputKeyword = ref<string>("");
const MAX_LENGTH = 10; // 등록 가능한 키워드 갯수

/**@description: 키워드 그룹목록 조회 */
const fetchKeywordGroupList = async (group_no?: string | number) => {
  options.groupList = [];
  const response = await KeywordAPI.getKeyWordGroups();

  const { data } = response;

  options.groupList = data ?? [];

  let slectGroupNo = group_no ?? props.id ?? null;

  if (slectGroupNo) {
    handleGroupInfoSelect(slectGroupNo);
  }
};

const handleGroupInfoSelect = (group_no?: string | number) => {
  groupInfo.value = new ScrapKeywordGroup({
    group_no: -1,
  });
  groupItems.value = [];
  newKeywords.value = [];
  // 스크롤 위치조정
  if (groupInfoInputEl.value && groupInfoEl.value) {
    const offset = (groupInfoInputEl.value as HTMLElement).offsetHeight;
    (groupInfoEl.value as HTMLElement).scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }
  if (group_no && Number(group_no) > 0) {
    const group = group_no
      ? options.groupList.find((item) => item.group_no === group_no)
      : null;
    if (group) {
      groupInfo.value = new ScrapKeywordGroup(group);
      groupItems.value = groupInfo.value.keyword_list.map((item) => item);
    } else {
      groupInfo.value = new ScrapKeywordGroup();
    }
  }
};

/**@description: 키워드 입력  */
const setKeyword = (val: any) => {
  if (!inputKeyword.value) return;

  if (!val.replace(/\s/g, "").length) return;
  // eslint-disable-next-line no-useless-escape
  const reg = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi;
  let tmepVal = val.replace(reg, "");

  inputKeyword.value = "";
  let errorMsg = "";

  const idx = groupItems.value.findIndex(
    (item: ScrapKeyword) => item.keyword === tmepVal
  );

  if (idx >= 0) {
    errorMsg = "이미 등록된 키워드 입니다";
  }

  if (tmepVal.length < 2) {
    errorMsg = "키워드는 2자 이상 등록해주세요.";
  }

  if (!errorMsg) {
    let count = groupItems.value.length + newKeywords.value.length; // 키워드 수 탐색
    errorMsg =
      count >= MAX_LENGTH ? `키워드는 ${MAX_LENGTH}까지 등록가능합니다.` : "";
  }

  if (errorMsg) {
    showNoti({
      message: errorMsg,
    });
    return;
  }
  newKeywords.value = Array.from(new Set([...newKeywords.value, tmepVal]));
};

const removeItem = (index: number) => {
  // let arr = select.value.filter((el) => el !== value);
  newKeywords.value.splice(index, 1);
};
const removeKeyword = async (removeKeywordNo: number) => {
  if (!removeKeywordNo) return;

  Swal.fire({
    text: "1선택된 키워드를 정말 삭제하시겠습니까?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#050505",
    cancelButtonText: "취소",
    confirmButtonText: "확인",
  }).then(async (res) => {
    if (res.value) {
      const index = groupItems.value.findIndex(
        (item) => item.keyword_no === `${removeKeywordNo}`
      );

      const response = await KeywordAPI.deleteKeyWord(
        `${removeKeywordNo}`,
        groupInfo.value.group_no
      );
      const { result, message } = response.data;

      if (result) {
        groupItems.value.splice(index, 1);
        fetchKeywordGroupList(groupInfo.value.group_no);

        if (
          Number(props.id) == Number(groupInfo.value?.group_no) &&
          !groupItems.value.length
        ) {
          emit("refresh", true);
        } else {
          emit("refresh-group", {
            group_no: groupInfo.value?.group_no,
          });
        }
      }

      showNoti({
        message: message,
        type: !result ? "error" : "",
      });
    }
  });
};
// 키워드 그룹 등록 & 수정
const submit = async () => {
  let count = groupItems.value.length + newKeywords.value.length; // 키워드 수 탐색
  let errorMsg = "";

  if (!groupInfo.value.group_name) {
    errorMsg = "키워드 그룹명을 입력해 주세요.";
  }

  if (!errorMsg && count > MAX_LENGTH) {
    errorMsg = `키워드는 ${MAX_LENGTH}까지 등록가능합니다.`;
  }

  if (!errorMsg && !newKeywords.value.length) {
    errorMsg =
      groupInfo.value.group_no &&
      groupInfo.value.origin.group_name !== groupInfo.value.group_name
        ? ""
        : "키워드를 입력해주세요.";
  }

  if (errorMsg) {
    showNoti({
      message: errorMsg,
      type: "error",
    });
    return;
  }

  showLoading();

  let msg = "";
  let msgType = "";
  const isNew =
    !props.id &&
    (!groupInfo.value.group_no || Number(groupInfo.value.group_no) == -1);
  // 키워드그룹 등록
  if (!groupInfo.value.group_no || Number(groupInfo.value.group_no) == -1) {
    // 키워드 그룹 등록

    const resGroup = await KeywordAPI.createKeyWordGroup({
      division: groupInfo.value.division,
      group_name: groupInfo.value.group_name,
    });

    const { result, message } = resGroup.data;
    msg = message;

    if (!result) {
      showNoti({
        message: msg,
      });
      return;
    } else {
      groupInfo.value.group_no = resGroup.data.group_no;
    }
  }
  // 이름 변경 된 경우
  if (
    groupInfo.value.group_no &&
    groupInfo.value.origin.name !== groupInfo.value.group_name
  ) {
    const resGroup = await KeywordAPI.updateKeyWordGroup({
      group_no: groupInfo.value.group_no,
      group_name: groupInfo.value.group_name,
    });

    const { result, message } = resGroup.data;
    msg = message;

    if (!result) {
      showNoti({
        message: resGroup.message,
      });
      return;
    }
  }

  if (!groupInfo.value.group_no) {
    hideLoading();
  }

  // let n = 0;
  // 그룹 정보 있는 경우 키워드 등록
  const res = await newKeywords.value.reduce(async (prev: any, cur, idx) => {
    await KeywordAPI.createKeyWord(cur, groupInfo.value.group_no).then(
      (res) => {
        if (idx === newKeywords.value.length - 1) {
          const { result, message } = res.data;
          msg = message;
          msgType = result ? "" : "error";
        }
      }
    );
    return idx;
  }, 0);

  // 새로고침은 바로
  await setTimeout(async () => {
    showNoti({
      message: msg,
      type: msgType,
    });

    if (Number(props.id) == Number(groupInfo.value?.group_no)) {
      emit("refresh", true);
    } else {
      emit("refresh-group", {
        group_no: isNew ? groupInfo.value?.group_no : props.id,
      });
    }

    if (!groupInfo.value?.group_no || Number(groupInfo.value?.group_no) < 0) {
      groupInfo.value = new ScrapKeywordGroup();
      groupItems.value = [];
    }

    fetchKeywordGroupList(
      groupInfo.value?.group_no && Number(groupInfo.value?.group_no) > -1
        ? groupInfo.value?.group_no
        : undefined
    );

    // 해당 키워드 스크랩
    await Promise.all([
      newKeywords.value.map(async (keyword) => {
        await KeywordAPI.scrapKeyWord(keyword);
      }),
    ]).then(() => {
      newKeywords.value = [];
      hideLoading();
    });

    // emit("close");
  }, 1000);
};

// Element 값 반환
const getElValue = (target?: any) => {
  return target ? (target as HTMLInputElement).value : "";
};

const keywordGroupDelete = async (group_no: string) => {
  Swal.fire({
    text: "그룹의 하위 키워드도 함께 삭제 됩니다. 키워드 그룹을 삭제하시겠습니까?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#050505",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then(async (res) => {
    if (res.value) {
      showLoading();

      const resGroup = await KeywordAPI.deleteKeyWordGroup(group_no);

      const { result, message } = resGroup.data;

      hideLoading();

      if (result) {
        groupInfo.value = new ScrapKeywordGroup();
        groupItems.value = [];
        newKeywords.value = [];

        if (Number(props.id) == Number(groupInfo.value?.group_no)) {
          emit("refresh", true);
        } else {
          emit("refresh-group", {
            group_no: groupInfo.value?.group_no,
          });
        }

        fetchKeywordGroupList();
      }

      showNoti({
        message: message,
      });
    }
  });
};

fetchKeywordGroupList();

nextTick(() => {
  showModal.value = true;
});
</script>

<style lang="scss" scoped>
$primary: #556ee6;

.group_manage_modal li:hover,
.group_manage_modal li.active {
  color: $primary;
  cursor: pointer;
  .fw-bold {
    font-weight: 800 !important;
  }
}
</style>
