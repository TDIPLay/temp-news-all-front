<template>
  <div class="custom_autocomplate_wrap">
    <form class="custom_searchbar_wrap">
      <slot name="prepend"></slot>
      <div class="searchbar_wrap py-1 ps-1 ps-sm-2">
        <input
          v-model="currentOv.inputText"
          ref="customInput"
          type="text"
          name="myCountry"
          class="form-control"
          autocomplete="off"
          :placeholder="props.placeholder"
          @keydown.prevent.enter="
            ({ target }:Event) => addSearchItem(getElValue(target))
          "
          @keydown.prevent.search="
            ({ target }:Event) => addSearchItem(getElValue(target))
          "
          @keydown.prevent.up="
            () => {
              currentOv.showACList = !currentOv.showACList
                ? currentOv.filteredAutoComplateList.length > 0
                : currentOv.showACList;
              currentOv.currentFocus < 0
                ? (currentOv.currentFocus = -1)
                : currentOv.currentFocus--;
            }
          "
          @keydown.prevent.down="
            () => {
              currentOv.showACList = !currentOv.showACList
                ? currentOv.filteredAutoComplateList.length > 0
                : currentOv.showACList;

              currentOv.currentFocus++;
            }
          "
          @input="({ target }:Event) => handleInputChange(target)"
        />
        <div
          v-if="currentOv.inputText !== ''"
          class="remove_input_text"
          style="z-index: 2"
        >
          <button
            type="button"
            @click="
              currentOv.inputText = '';
              currentOv.showACList = false;
            "
          >
            <i class="bx bx-x-circle"></i>
          </button>
        </div>
        <!-- autocomplete Items 리스트 -->
        <div
          :id="`${props.id}_${props.type}_autocomplete_list`"
          class="autocomplete_items"
          v-if="currentOv.autocomplateList.length && currentOv.showACList"
        >
          <div ref="customACList">
            <div
              v-for="(item, index) in currentOv.filteredAutoComplateList"
              :key="index"
              :class="{
                autocomplete_active: currentOv.currentFocus == index,
              }"
              :id="index"
              @click.prevent="addSearchItem(item)"
            >
              {{ item.name }} / {{ currentOv.currentFocus }}/{{ index }}
            </div>
          </div>
        </div>
      </div>
    </form>
    <!-- 선택된 Items 리스트 -->
    <div
      class="selected_items_wrap"
      v-if="currentOv.selectedItemList && !props.hideSelectedItem"
    >
      <div
        v-for="(item, index) in currentOv.selectedItemList"
        :key="index"
        class="selected_item"
        :class="{
          exclude_item: props.type == 'exclude',
          include_item: props.type == 'include',
        }"
      >
        {{ item.name }}
        <button @click="removeSelectItem(index)">
          <i class="bx bx-x-circle"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCommonStore } from "@/store/common";
import { computed } from "@vue/reactivity";
import { onMounted, ref, reactive, watch, onUnmounted } from "vue";

class ACOv {
  id: string | number = "";
  name = "";
  type: "include" | "exclude" = "include";
  constructor(init?: any) {
    if (!init) return;
    this.id = init.id ?? "";
    this.name = init.name ?? "";
    this.type = init.type;
  }
}
const { showNoti } = useCommonStore();

const customInput = ref(null);
const customACList = ref(null);
const props = defineProps({
  defaultSelected: {
    type: Array,
    default: () => {
      return [] as string[];
    },
  },
  id: {
    type: String,
  },
  type: {
    type: String,
    default: "include", // ≈
  },
  idKey: {
    type: String,
    default: "id",
  },
  nameKey: {
    type: String,
    default: "name",
  },
  hideSelectedItem: {
    type: Boolean,
    default: false,
  },
  maxCount: {
    type: Number,
    default: 20,
  },
  curCount: {
    type: Number,
    default: 0,
  },
  placeholder: {
    type: String,
    default: "",
  },
  autocomplateList: {
    type: Array,
    default: () => {
      return [] as any[];
    },
  },
});
const currentOv = reactive<{
  inputText: string;
  selectedItemList: ACOv[];
  autocomplateList: ACOv[];
  filteredAutoComplateList: ACOv[];
  currentFocus: number;
  showACList: boolean;
}>({
  inputText: "",
  selectedItemList: [],
  autocomplateList: [],
  filteredAutoComplateList: [],
  currentFocus: 0,
  showACList: false,
});

watch(
  () => [...props.autocomplateList],
  (newVal: any[]) => {
    setCurrentAcList(newVal);
  }
);

watch(
  () => props.defaultSelected.map((item) => `${item}`),
  (newVal: string[], prevVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(prevVal)) {
      setSelectedList(newVal);
    }
  }
);
// 값 입력시
const handleInputChange = (target: any) => {
  if (!target) return;
  let searchTxt = target?.value ?? "";

  currentOv.filteredAutoComplateList = [];
  currentOv.showACList = false;
  currentOv.currentFocus = -1;

  // if (searchTxt.length > 19) {
  //   showNoti({
  //     message: `분석은 최대 ${props.maxCount}개까지 가능합니다`,
  //   });
  //   return;
  // }

  if (!searchTxt) return;

  currentOv.filteredAutoComplateList = currentOv.autocomplateList.filter(
    (item) => item.name.indexOf(searchTxt) > -1
  );

  currentOv.showACList = currentOv.filteredAutoComplateList.length > 0;
};

// 최대 갯수 오류 문구
const errCountLabel = ref(
  `최대 ${props.maxCount}개까지 복수키워드 분석이 가능합니다. 키워드 입력 후 ‘Tab’ 키를 누르시면 구분됩니다.`
);

const emit = defineEmits<{
  (e: "set-item", value?: any): void;
}>();

const setCurrentAcList = (setAcList: any[]) => {
  // 전달받은 autocomplate 목록이 있으면 넣기
  if (setAcList.length) {
    currentOv.autocomplateList = setAcList.map((item) => {
      // 문자인 경우
      if (typeof item != "object") {
        return new ACOv({
          id: item,
          name: item,
          type: props.type,
        });
      }

      return new ACOv({
        id: item[props.idKey],
        name: item[props.nameKey],
        type: props.type,
      });
    });

    // 미리 선택된 값이 있는경우
    if (props.defaultSelected.length) {
      currentOv.selectedItemList = currentOv.autocomplateList.filter((item) =>
        props.defaultSelected.includes(`${item.id}`)
      );
    } else {
      currentOv.selectedItemList = props.defaultSelected.map(
        (item) =>
          new ACOv({
            id: item,
            name: item,
            type: props.type,
          })
      );
    }
  } else {
    currentOv.autocomplateList = [];
  }
};

const setSelectedList = (setList: any[]) => {
  if (currentOv.autocomplateList.length) {
    currentOv.selectedItemList = currentOv.autocomplateList.filter((item) =>
      setList.includes(`${item.id}`)
    );
  } else {
    currentOv.selectedItemList = setList.map(
      (item) =>
        new ACOv({
          id: item,
          name: item,
          type: props.type,
        })
    );
  }
};

// 선택한 내용 ID 목록
const selectedItemIdList = computed(() => {
  const tempIdList = currentOv.selectedItemList.map((item: ACOv) => item.id);
  if (props.autocomplateList.length) {
    const res: string[] = [];

    props.autocomplateList.map((item: any) => {
      const acItem = new ACOv(item);
      if (tempIdList.includes(acItem.id)) {
        res.push(`${acItem.id}`);
      }
    });
    return res;
  }
  return tempIdList;
});

// 선택한 내용 Name 목록
const selectedItemNameList = computed(() => {
  const tempIdList = currentOv.selectedItemList.map((item: ACOv) => item.id);
  if (props.autocomplateList.length) {
    const res: string[] = [];

    props.autocomplateList.map((item: any) => {
      if (tempIdList.includes(item.id)) {
        res.push(`${item.name}`);
      }
    });
    return res;
  }
  return currentOv.selectedItemList.map((item: ACOv) => item.name);
});

// 키워드 변경시
const setItem = () => {
  if (currentOv.selectedItemList.length > props.defaultSelected.length + 1) {
    currentOv.selectedItemList = [
      ...currentOv.selectedItemList.filter((item: ACOv) =>
        props.defaultSelected.includes(`${item.id}`)
      ),
      currentOv.selectedItemList[currentOv.selectedItemList.length - 1],
    ];
  }

  emit("set-item", {
    selected: currentOv.selectedItemList,
    selected_id: currentOv.selectedItemList.map((item) => item.id),
    selected_name: currentOv.selectedItemList.map((item) => item.name),
    type: props.type,
  });
};

// 전체 삭제
const removeAll = () => {
  currentOv.inputText = "";
  currentOv.selectedItemList = [];

  setItem();
};

// 검색된 키워드 중 특정항목만을 삭제합니다
const removeSelectItem = (index: number) => {
  currentOv.selectedItemList.splice(index, 1);
  setItem();
};

//이벤트에 따라 키워드를 검색해줍니다
const addSearchItem = (searchItem: ACOv) => {
  // 방향키로 선택 Focus 되어있는 상태인 경우
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const curACListEl = customACList.value! as HTMLElement;
  if (currentOv.currentFocus > -1 && curACListEl?.childNodes?.length) {
    const activeItem = curACListEl.querySelectorAll(".autocomplete_active");

    currentOv.showACList = false;
    currentOv.currentFocus = -1;

    addSearchItem(
      currentOv.filteredAutoComplateList[(activeItem as any)[0].id]
    );
    return;
  }

  let dubble = false; // 중복 여부

  if (!searchItem || !searchItem.id) return;

  currentOv.showACList = false;
  currentOv.currentFocus = -1;

  if (
    currentOv.selectedItemList.length > props.maxCount ||
    props.curCount >= props.maxCount
  ) {
    showNoti({
      message: `키워드는 최대 ${props.maxCount}개까지 가능합니다`,
    });
    return;
  }
  // autocomplateList 목록이 있는 경우, 해당 목록 안에서 검색 가능
  if (currentOv.autocomplateList.length) {
    const idx = currentOv.autocomplateList.findIndex(
      (item) => item.id == searchItem.id
    );
    if (idx < 0) {
      showNoti({
        message: "일치하는 값이 존재하지 않습니다.",
      });
      return;
    }
  }

  currentOv.selectedItemList.map((selectedItem: ACOv) => {
    if (selectedItem.id === searchItem.id) {
      dubble = true;
      currentOv.showACList = false;
      return;
    }
  });

  if (dubble === false) {
    currentOv.selectedItemList = [...currentOv.selectedItemList, searchItem];
  }
  currentOv.inputText = "";
  setItem();
};

// Element 값 반환
const getElValue = (target?: any) => {
  if (!target) return "";

  const text = (target as HTMLInputElement).value;
  let res = new ACOv({
    id: (target as HTMLInputElement).value,
    name: (target as HTMLInputElement).value,
    type: props.type,
  });

  if (currentOv.autocomplateList.length) {
    const idx = currentOv.autocomplateList.findIndex(
      (item) => item.name == text
    );

    res = currentOv.autocomplateList[idx];
  }

  return res;
};

const addActive = () => {};

setCurrentAcList(props.autocomplateList);
if (props.defaultSelected.length) {
  setSelectedList(props.defaultSelected);
}
// 화면이 다 그려지고 난 후
onMounted(() => {
  window.addEventListener("click", function (e) {
    if (!currentOv.showACList) return;
    currentOv.showACList = false;
  });
});

onUnmounted(() => {
  window.removeEventListener("click", function (e) {
    if (!currentOv.showACList) return;
    currentOv.showACList = false;
  });
});
</script>

<style lang="scss">
.custom_autocomplate_wrap {
  position: relative;
  justify-items: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  .custom_searchbar_wrap {
    display: flex;
    width: 100%;
  }
  * {
    box-sizing: border-box;
  }

  /*the container must be positioned relative:*/
  .autocomplete {
    position: relative;
    display: inline-block;
  }

  .searchbar_wrap {
    position: relative;
    background-color: transparent;
    display: flex;
    align-items: center;
    padding-left: 12px;
    // border-radius: 20px;
    box-sizing: border-box;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0px;
    .remove_input_text {
      position: absolute;
      right: 0;
    }
    .delete_btn,
    .remove_input_text {
      padding-right: 8px;
      button {
        width: 24px;
        height: 24px;
        border: 0;
        background-color: transparent;
        text-align: center;
        i {
          vertical-align: middle;
          font-size: 20px;
          margin-left: auto;
        }
      }
    }

    input {
      min-width: 0;
      box-sizing: content-box;
      flex-grow: 1;
      flex-shrink: 1;
      &::placeholder {
        color: #d6dce2;
      }
    }
  }

  .autocomplete_items {
    position: absolute;
    border: 1px solid #d4d4d4;
    border-top: none;
    z-index: 99;
    /*position the autocomplete items to be the same width as the container:*/
    top: 100%;
    left: 12px;
    right: 0;
    width: calc(100% - 12px);
    overflow: hidden;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 4px 0;

    & > div {
      overflow: auto;
      max-height: 300px;
      font-size: 12px;

      div {
        padding: 10px;

        cursor: pointer;

        border-bottom: 1px solid #d4d4d4;
        &:last-child {
          border-bottom: 0px solid #d4d4d4;
        }

        &:hover {
          background-color: #e9e9e9;
        }
        &.autocomplete_active {
          background-color: DodgerBlue !important;
          color: #ffffff;
        }
      }
    }
  }

  .selected_items_wrap {
    padding: 10px 5px;
    align-items: center;
    display: flex;

    .selected_item {
      display: flex;
      border: 1px solid gray;
      border-radius: 5px;
      height: auto;
      width: auto;
      align-items: center;
      margin-left: 5px;
      margin-top: 3px;
      margin-bottom: auto;
      padding: 2px 5px 2px 7px;
      font-size: 12px;

      &.exclude_item {
        border-color: red;
        color: red;
      }
      &.include_item {
        border-color: blue;
        color: blue;
      }

      button {
        img {
          width: 20px;
          height: 20px;
        }
        margin-left: 5px;
        width: 20px;
        height: 20px;
      }
    }
  }

  select {
    margin: auto;
    margin-left: 0;
    min-width: 75px;
    @media screen and (max-width: 500px) {
      height: 34px !important;
      padding-left: 3px 10px !important;
      background-position: calc(100% - 10px) center !important;
    }
  }
}

@media screen and (max-width: 500px) {
  .custom_autocomplate_wrap {
    .searchbar_wrap {
      input {
        padding: 4 auto;
      }
    }
  }
}
</style>
