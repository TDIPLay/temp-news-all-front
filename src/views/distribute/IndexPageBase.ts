import { reactive, ref } from "vue";

import moment from "moment";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useCommonStore } from "@/store/common";
import { computed } from "@vue/reactivity";
import { DistributeAPI } from "@/api/distribute";
import {
  DistributeNews,
  DistributeNewsStatusOptions,
} from "@/models/distribute";
export interface IFilterObj {
  status: any[];
  search_text: string;
  start_date: string;
  end_date: string;
}

export const useFetch = () => {
  const { showLoading, hideLoading } = useCommonStore();
  const { showNoti } = useCommonStore();
  const router = useRouter();
  const tempSelectDistibuteNo = ref("");
  const distibuteForm = ref();
  const distributeList = ref<DistributeNews[]>([]);
  const selectedDistribute = ref<DistributeNews>(new DistributeNews());
  const isEditable = computed(
    () => Number(selectedDistribute.value.status) < 2
  );

  const editorConfig: any = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "indent",
      "outdent",
      "|",
      "blockQuote",
      "undo",
      "redo",
    ],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
      ],
    },
    placeholder: `이곳에 뉴스 보도 내용을 작성해주세요.`,
    //   placeholder: `이곳에 뉴스 보도 내용을 작성해주세요.

    // 기본적인 뉴스 보도의 구성 Tip!
    // 1. 리드문 (뉴스 보도의 내용 한문장 요약)
    // 2. 회사 소개 (우리 회사와 사업 내용 소개)
    // 3. 부연 설명 + 성과 (뉴스 보도 주요 내용의 부연설명과 우리 회사의 기존 성과)
    // 4. 대표 코멘트 (향후 계획과 사업 비전 소개)
    // 5.  추가적인 설명 삽입`,
    language: "ko",
  };

  const isAdmin = computed(() => {
    const type = localStorage.getItem("user_account_type") ?? "";
    return (type ? JSON.parse(type) : 0) == 1;
  });

  /**@description: 뉴스 보도 목록 조회 */
  const fetchDistributeList = async () => {
    distributeList.value = [];

    const response = await DistributeAPI.getDistributeNews();
    const { distribute } = response.data;

    if (distribute && distribute.length > 0) {
      distributeList.value = distribute.map(
        (item: any) => new DistributeNews(item)
      );
    }
    hideLoading();
  };

  /**@description: 뉴스 보도 상세 조회 */
  const fetchDistributeInfo = async (dis_no: string) => {
    distributeList.value = [];

    const response = await DistributeAPI.getDistributeNewsInfo(dis_no);
    const { distribute } = response.data;

    if (!distribute) {
      showNoti({
        message: "해당 보도자료가 존재하지 않습니다.",
        type: "error",
      });
      router.replace("/distribute");
      return;
    }

    selectedDistribute.value = new DistributeNews(distribute);
  };

  /**@description: 키워드 선택시 */
  const handleDistributeClick = async (item: DistributeNews) => {
    // 동일한 조건이면 return
    if (selectedDistribute.value.dis_no === item.dis_no) return;
    selectedDistribute.value = new DistributeNews(item);
  };
  const initSelectedData = () => {
    selectedDistribute.value = new DistributeNews();
  };

  /**@description: 파일 업로드 */
  const uploadImageFile = (target: any) => {
    if (!target) return;

    const file = target.files;
    let validation = true;
    let message = "";

    if (file.length > 1) {
      validation = false;
      message = `파일은 한개만 등록 가능합니다.`;
    }

    // if (file[0].size > 1024 * 1024 * 2) {
    //   message = `${message}, 파일은 용량은 2MB 이하만 가능합니다.`;
    //   validation = false;
    // }

    if (file[0].type.indexOf("image") < 0) {
      message = `${message}, 이미지 파일만 업로드 가능합니다.`;
      validation = false;
    }

    if (!validation) {
      selectedDistribute.value.file = null;
      showNoti({
        message: message,
      });
    }
    selectedDistribute.value.file = file[0];
  };

  /**@description: 등록 / 수정 */
  const submit = async () => {
    const validMsg = await selectedDistribute.value.vaild();

    if (validMsg) {
      showNoti({
        message: validMsg,
        type: "error",
      });
      return;
    }

    if (!selectedDistribute.value.dis_no && !selectedDistribute.value.file) {
      showNoti({
        message: "추가자료를 첨부해 주세요.",
        type: "error",
      });
      return;
    }

    if (!selectedDistribute.value.dis_no && !selectedDistribute.value.file) {
      showNoti({
        message: "추가자료를 첨부해 주세요.",
        type: "error",
      });
      return;
    }

    showLoading();
    const formDataParams = new FormData();

    const payload = await selectedDistribute.value.saveDataFormat();

    for (const key in payload) {
      formDataParams.append(key, (payload as any)[key]);
      router.back();
    }

    if (!payload) {
      showNoti({
        message: "저장할 내용이 없습니다.",
        type: "error",
      });
      return;
    }

    const { data } = !selectedDistribute.value.dis_no
      ? await DistributeAPI.createDistributeNews(formDataParams)
      : await DistributeAPI.updateDistributeNews(formDataParams);

    setTimeout(() => {
      hideLoading();

      if (data) {
        if (data.result) {
          fetchDistributeList();
        }

        showNoti({
          message: data?.message,
          type: data.result > 0 ? "info" : "error",
        });
      }
    }, 500);
  };

  /**@description: 상태 변경 */
  const handleSelectStatusChange = (item: any) => {
    if (Number(item.value) == selectedDistribute.value.status) return;

    Swal.fire({
      text: "보도자료 상태를 변경하시겠습니까?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (res) => {
      if (res.value) {
        await handleSelectStatus(item.value);
      }
    });
  };
  /**@description: 상태 변경 저장 */
  const handleSelectStatus = async (status: number) => {
    selectedDistribute.value.status = status;

    showLoading();

    const { data } = await DistributeAPI.updateDistributeNewsStatus(
      selectedDistribute.value.dis_no,
      `${selectedDistribute.value.status}`
    );

    setTimeout(() => {
      hideLoading();

      if (data) {
        if (data.result) {
          selectedDistribute.value = new DistributeNews();
        }

        showNoti({
          message: data?.message,
          type: data.result > 0 ? "info" : "error",
        });
      }
    }, 1000);
  };

  // 배포신청서 삭제
  const handleDeleteDistibute = async (distribute_no: string) => {
    const dis_no = distribute_no;

    Swal.fire({
      text: "보도자료를 식제하시겠습니까?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (res) => {
      if (res.value) {
        showLoading();
        const response = await DistributeAPI.deleteDistributeNews(dis_no);
        const { result, message } = response.data;

        hideLoading();

        if (result) {
          if (selectedDistribute.value?.dis_no == dis_no) {
            selectedDistribute.value = new DistributeNews();
          }

          router.back();
        }

        showNoti({
          message: message,
        });
      }
    });
  };

  const filterObj = reactive<IFilterObj>({
    status: [],
    search_text: "",
    start_date: moment().subtract(1, "M").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
  });
  const tempData = reactive({
    start_date: new Date(filterObj.start_date),
    end_date: new Date(filterObj.end_date),
  });
  const pagenation = reactive({
    current: 1,
    limit: 100,
    isMax: false,
  });

  /**@description: 검색 필터 초기화 */
  const initFilter = () => {
    filterObj.status = [];
    filterObj.search_text = "";
    filterObj.start_date = moment().subtract(1, "M").format("YYYY-MM-DD");
    filterObj.end_date = moment().format("YYYY-MM-DD");

    tempData.start_date = new Date(filterObj.start_date);
    tempData.end_date = new Date(filterObj.end_date);
  };

  /**@description: 초기화 및 데이터 재 조회 */
  const refreshList = () => {
    initFilter();
    // topNewsList.value = [];
    Promise.all([fetchDistributeList()]);
    return;
    // fetchTopNewsList();
  };
  const handleFilterStatus = (statusInfo: any) => {
    const idx = filterObj.status.findIndex(
      (item) => item.value == statusInfo.value
    );
    if (idx < 0) {
      filterObj.status.push(statusInfo);
    } else {
      filterObj.status.splice(idx, 1);
    }
  };
  return {
    DistributeNewsStatusOptions,
    tempSelectDistibuteNo,
    distibuteForm,
    distributeList,
    selectedDistribute,
    isEditable,
    editorConfig,
    isAdmin,
    filterObj,
    tempData,
    pagenation,

    fetchDistributeList,
    fetchDistributeInfo,
    handleDistributeClick,
    initSelectedData,
    uploadImageFile,
    submit,
    handleSelectStatusChange,
    handleSelectStatus,
    handleDeleteDistibute,
    initFilter,
    refreshList,
    handleFilterStatus,
  };
};
