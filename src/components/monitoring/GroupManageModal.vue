<template>
  <b-modal
    v-model="showModal"
    size="md"
    centered
    :title="props.id ? '키워드 그룹 관리' : '새 키워드 그룹 추가'"
    hide-footer
    @close="emit('close')"
    no-close-on-esc
    no-close-on-backdrop
  >
    <div class="card-body">
      <div class="row m-0">
        <!-- 키워드 그룹 추가 -->
        <div class="tag_register" v-if="!props.id">
          <b-form-select
            v-model="groupInfo.group_no"
            size="sm"
            :options="options.groupList"
            text-field="group_name"
            value-field="group_no"
            class="form-control font-size-12"
            placeholder="키워드 그룹을 선택해 주세요."
            @update:model-value="handleGroupInfoSelect"
          >
            <template #first>
              <v-list-item
                style="height: 20px"
                @click="handleGroupInfoSelect(null)"
              >
                <i class="mdi mdi-plus-box font-size-14"></i>
                새로운 키워드 그룹
              </v-list-item>

              <v-divider class="ma-0"></v-divider>
            </template>
          </b-form-select>
          <!-- 
          <select
            v-model="groupInfo.group_no"
            placeholder="키워드 그룹을 선택해 주세요."
            :items="options.groupList"
            item-title="group_name"
            item-value="group_no"
            density="comfortable"
            bg-color="transparent"
            hide-details
            class="custom-select-box"
            variant="plain"
            :style="{
              height: 'auto',
              minHeight: '42px',
            }"
            :menu-props="{ closeOnContentClick: true }"
            @update:model-value="handleGroupInfoSelect"
          ></select> -->
        </div>
        <div class="col" v-if="!!props.id || groupInfo.division == 'regist'">
          <input
            v-model="groupInfo.group_name"
            maxlength="20"
            placeholder="키워드 그룹명을 입력해주세요."
            class="form-control font-size-12"
          />
        </div>

        <div class="mt-3" v-if="groupItems.length">
          <div class="card-title col-auto col-sm-12 text-start">
            등록한 키워드
            <span class="font-size-11"> ({{ groupItems.length }}) </span>
          </div>

          <div class="pb-3">
            <span
              v-for="(item, index) in groupItems"
              :key="index"
              class="col-auto badge rounded-pill font-size-11 badge-soft-secondary me-2"
            >
              #{{ item.keyword }}
              <i
                style="cursor: pointer"
                class="mdi mdi-close"
                @click="removeKeyword(item.keyword_no)"
              >
              </i>
            </span>
          </div>
        </div>

        <div class="modal_inner_box">
          <div class="card-title col-auto col-sm-12 text-start">
            등록할 키워드
            <span class="font-size-11">
              ({{ newKeywords.length }} / {{ MAX_LENGTH - groupItems.length }})
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
              class="col-auto badge rounded-pill font-size-13 badge-soft-secondary me-2"
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
          class="row m-0 justify-content-center align-items-center px-3 pt-3"
        >
          <div class="col-auto d-flex">
            <button
              v-if="props.id"
              class="btn btn-outline-secondary px-4 me-2"
              :class="{ disabled: loading }"
              @click="deleteGroup()"
            >
              삭제
            </button>
            <button
              class="btn btn-danger px-4"
              :class="{ disabled: loading }"
              @click="submit"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { useCommonStore } from "@/store/common";
import { ref, reactive, nextTick } from "vue";
import Swal from "sweetalert2";

import { ScrapKeywordGroup, ScrapKeyword } from "@/models/scrap";
import { KeywordAPI } from "@/api/keyword";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";

const openDialog = true;
const { loading, showLoading, hideLoading } = useCommonStore();
const { showNoti } = useCommonStore();
const props = defineProps({
  id: {
    type: String || Number,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "close", value?: any): void;
  (e: "refresh", value?: any): void;
}>();

const options = reactive<{
  groupList: any[];
}>({
  groupList: [],
});

const showModal = ref(false);
// 그룹 정보
const groupInfo = ref<ScrapKeywordGroup>(
  new ScrapKeywordGroup({
    group_no: -1,
  })
);
const groupItems = ref<ScrapKeyword[]>([]); // 키워드 그룹에 속한 키워드

const showRemoveModal = ref<boolean>(false);
const showRemovGroupeModal = ref<boolean>(false);

const removeKeywordNo = ref();
const newKeywords = ref<string[]>([]);
const inputKeyword = ref<string>("");
const MAX_LENGTH = 10; // 등록 가능한 키워드 갯수

/**@description: 키워드 그룹에 등록되어있는 키워드 조회 */
const fetchKeywords = async (group_no: string) => {
  if (group_no) {
    groupInfo.value = new ScrapKeywordGroup({
      group_no: group_no,
      group_name: props.name || "",
    });
  }

  const response = await KeywordAPI.getKeyWords(group_no);

  const { keyword } = response?.data;

  groupItems.value = [];

  if (keyword && keyword.length > 0) {
    groupItems.value = [...keyword];
  }

  // groupItems.value =
  // axiosService.get("v2/news/keywords").then((res) => {
  //   groupItems.value = res.data.keywords;
  // });
};

/**@description: 키워드 그룹목록 조회 */
const fetchKeywordGroupList = async () => {
  const response = await KeywordAPI.getKeyWordGroups();

  const { data } = response;

  if (data && data.length > 0) {
    options.groupList = [
      {
        group_name: "새로운 키워드",
        group_no: -1,
      },
      ...data,
    ];
  }
  // groupItems.value =
  // axiosService.get("v2/news/keywords").then((res) => {
  //   groupItems.value = res.data.keywords;
  // });
};

const handleGroupInfoSelect = (group_no?: any) => {
  groupItems.value = [];
  newKeywords.value = [];
  if (group_no < 0) {
    groupInfo.value = new ScrapKeywordGroup();
    groupItems.value = [];
  } else {
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
    text: "선택된 키워드를 정말 삭제하시겠습니까?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#34c38f",
    cancelButtonColor: "#f46a6a",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
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
      }

      emit("refresh");

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
      props.id && props.name !== groupInfo.value.group_name
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

  // 키워드 등록
  if (!groupInfo.value.group_no) {
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
  if (props.id && props.name !== groupInfo.value.group_name) {
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

  if (!groupInfo.value.group_no) return;

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
    return (prev = idx);
  }, 0);

  // res.then((r) => {
  //   console.log("res>>", r);
  //   emit("refresh");
  // });

  // 새로고침은 바로
  await setTimeout(async () => {
    // console.log("res>>", res);
    hideLoading();

    showNoti({
      message: msg,
      type: msgType,
    });

    emit("refresh");

    // 해당 키워드 스크랩
    await Promise.all([
      newKeywords.value.map(async (keyword) => {
        await KeywordAPI.scrapKeyWord(keyword);
      }),
    ]);

    emit("close");
  }, 1000);
};

// Element 값 반환
const getElValue = (target?: any) => {
  return target ? (target as HTMLInputElement).value : "";
};

// 키워드 그룹 삭제
const deleteGroup = async () => {
  Swal.fire({
    text: "그룹의 하위 키워드도 함께 삭제 됩니다. 키워드 그룹을 삭제하시겠습니까?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#34c38f",
    cancelButtonColor: "#f46a6a",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then(async (res) => {
    if (res.value) {
      const resGroup = await KeywordAPI.deleteKeyWordGroup(
        groupInfo.value.group_no
      );

      const { result, message } = resGroup.data;

      if (result) {
        emit("refresh");
        emit("close");
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

if (props.id) {
  fetchKeywords(props.id as string);
}
</script>

<style lang="scss" scoped>
$primary: #556ee6;
</style>
