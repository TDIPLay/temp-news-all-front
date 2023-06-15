import { reactive, ref } from "vue";

import moment from "moment";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useCommonStore } from "@/store/common";
import { computed } from "@vue/reactivity";
import { BriefingAPI } from "@/api/briefing";
import { Briefing } from "@/models/briefing";
import { NewListItem } from "@/models/scrap";
import { KeywordAPI } from "@/api/keyword";
export interface IFilterObj {
  search_text: string;
  start_date: string;
  end_date: string;
}

export const useFetch = () => {
  const { showLoading, hideLoading } = useCommonStore();
  const { showNoti } = useCommonStore();
  const router = useRouter();
  const briefingList = ref<Briefing[]>([]);
  const selectedBriefing = ref<Briefing>(new Briefing());
  const isEditable = computed(() => Number(selectedBriefing.value.status) < 2);

  const selectedSearchDays = ref(30);
  const filterObj = reactive<IFilterObj>({
    search_text: "",
    start_date: moment()
      .subtract(selectedSearchDays.value, "d")
      .format("YYYY-MM-DD"),
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

  const saveNewsList = ref<NewListItem[]>([]); // 미디어 스크랩 목록
  const saveNewsGroups = ref<any[]>([]); // 미디어 스크랩 목록 키워드 별로 그룹
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
    language: "ko",
  };
  // 미디어 스크랩 목록 키워드 별로 그룹
  const saveNewsDateFilter = reactive({
    days: 7,
    startDate: moment().subtract(7, "d").format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
  });

  /**@description: 브리핑 목록 조회 */
  const fetchBriefingList = async (): Promise<void> => {
    briefingList.value = [];

    const response = await BriefingAPI.getBriefing();
    const { briefing } = response.data;
    hideLoading();

    if (briefing && briefing.length > 0) {
      briefingList.value = briefing.map((item: any) => new Briefing(item));
    }
  };

  /**@description: 뉴스 보도 상세 조회 */
  const fetchBriefingInfo = async (briefing_no: string) => {
    selectedBriefing.value = new Briefing();

    const response = await BriefingAPI.getBriefingInfo(briefing_no);
    const { briefing } = response.data;

    if (!briefing) {
      showNoti({
        message: "해당 브리핑이 존재하지 않습니다.",
        type: "error",
      });
      router.replace("/briefing");
      return;
    }

    selectedBriefing.value = new Briefing(briefing);
  };

  /**@description: 키워드 선택시 */
  const handleDistributeClick = async (item: Briefing) => {
    // 동일한 조건이면 return
    if (selectedBriefing.value.briefing_no === item.briefing_no) return;
    selectedBriefing.value = new Briefing(item);
  };
  const initSelectedData = () => {
    selectedBriefing.value = new Briefing();
  };

  /**@description: 미디어 스크랩 목록 조회 */
  const fetchSaveNewsList = async (): Promise<void> => {
    saveNewsList.value = saveNewsGroups.value = [];

    const response = await KeywordAPI.fetchNewsSaveList({
      start_date: saveNewsDateFilter.startDate,
      end_date: saveNewsDateFilter.endDate,
      skip: 0,
      limit: 500,
    });

    const { newslist } = response?.data ?? [];

    if (newslist && newslist.length) {
      saveNewsList.value = newslist.map((item: any) => {
        const classItem = new NewListItem(item);
        let keywordIdx = saveNewsGroups.value.findIndex(
          (group) => group.keyword_no === item.keyword_no
        );

        // 없으면 추가
        if (keywordIdx < 0) {
          saveNewsGroups.value.push({
            keyword_no: item.keyword_no,
            keyword: classItem.decode_keyword,
            news_list: [],
          });

          keywordIdx = saveNewsGroups.value.length - 1;
        }
        // group > list 안에 푸시
        saveNewsGroups.value[keywordIdx].news_list.push(classItem);

        return classItem;
      });
    }
  };

  /**@description: 미리보기 페이지 창 띄우기 */
  const openPreviewPage = () => {
    if (!selectedBriefing.value) return;
    window.open("/briefing/preview?key=" + selectedBriefing.value.briefing_key);
  };

  /**@description: 등록 / 수정 */
  const submit = async () => {
    const validMsg = await selectedBriefing.value.vaild();

    if (validMsg) {
      showNoti({
        message: validMsg,
        type: "error",
      });
      return;
    }

    showLoading();
    const payload = await selectedBriefing.value.saveDataFormat();

    if (!payload) {
      showNoti({
        message: "저장할 내용이 없습니다.",
        type: "error",
      });
      return;
    }

    const { data } = !selectedBriefing.value.briefing_no
      ? await BriefingAPI.createBriefing(payload)
      : await BriefingAPI.updateBriefing(payload);

    setTimeout(() => {
      hideLoading();

      if (data) {
        if (data.result) {
          fetchBriefingList();
          selectedBriefing.value = new Briefing();

          showNoti({
            message: data?.message,
            type: data.result > 0 ? "info" : "error",
          });
          router.back();
        } else {
          showNoti({
            message: data?.message,
            type: data.result > 0 ? "info" : "error",
          });
        }
      }
    }, 500);
  };

  // 배포신청서 삭제
  const handleDeleteDistibute = async (briefing_no: string) => {
    Swal.fire({
      text: "브리핑을 식제하시겠습니까?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (res) => {
      if (res.value) {
        showLoading();
        const response = await BriefingAPI.deleteBriefing(briefing_no);
        const { result, message } = response.data;

        hideLoading();

        if (result) {
          if (selectedBriefing.value?.briefing_no == briefing_no) {
            selectedBriefing.value = new Briefing();
          }

          router.back();
        }

        showNoti({
          message: message,
        });
      }
    });
  };

  /**@description: 검색 필터 초기화 */
  const initFilter = () => {
    filterObj.search_text = "";
    selectedSearchDays.value = 30;

    filterObj.start_date = moment()
      .subtract(selectedSearchDays.value, "d")
      .format("YYYY-MM-DD");
    filterObj.end_date = moment().format("YYYY-MM-DD");

    tempData.start_date = new Date(filterObj.start_date);
    tempData.end_date = new Date(filterObj.end_date);
  };

  /**@description: 초기화 및 데이터 재 조회 */
  const refreshList = () => {
    initFilter();
    // topNewsList.value = [];
    Promise.all([fetchBriefingList()]);
    return;
    // fetchTopNewsList();
  };

  /**@description: 닐찌 타입 변경 */
  const changeDateType = () => {
    saveNewsDateFilter.startDate = moment()
      .subtract(saveNewsDateFilter.days, "d")
      .format("YYYY-MM-DD");
    fetchSaveNewsList();
  };

  const handleNewsClick = (news: NewListItem) => {
    const IncludeKeywordIdx =
      selectedBriefing.value.briefing_news_list.findIndex(
        (item) => item.group_no == news.keyword_no
      );

    if (IncludeKeywordIdx < 0) {
      selectedBriefing.value.briefing_news_list.push({
        group_name: news.decode_keyword,
        group_no: news.keyword_no,
        news_list: [news],
      });

      return;
    }

    const IncludeListIdx = selectedBriefing.value.briefing_news_list[
      IncludeKeywordIdx
    ].news_list.findIndex((item) => item.news_no == news.news_no);

    if (IncludeListIdx < 0) {
      selectedBriefing.value.briefing_news_list[
        IncludeKeywordIdx
      ].news_list.push(news);
    } else {
      selectedBriefing.value.briefing_news_list[
        IncludeKeywordIdx
      ].news_list.splice(IncludeListIdx, 1);
    }
  };

  const handleUpdateDatePicker = (
    type: "start_date" | "end_date",
    date: Date
  ) => {
    filterObj[type] = moment(date).format("YYYY-MM-DD");
    const diffDays = moment
      .duration(moment(filterObj.end_date).diff(filterObj.start_date))
      .asDays(); // 1

    selectedSearchDays.value = [7, 30, 90].includes(diffDays) ? diffDays : 0;
  };
  const handleSearchDay = (day: number) => {
    selectedSearchDays.value = day;
    const today = moment().format("YYYY-MM-DD");
    filterObj.start_date = moment().subtract(day, "days").format("YYYY-MM-DD");
    filterObj.end_date = today;
    tempData.end_date = new Date(filterObj.end_date);
    tempData.start_date = new Date(filterObj.start_date);
  };

  /**@description: 기사 추가 */
  const selectedBrefingAddReport = (data: any) => {
    const { group_no, report } = data;
    const groupIdx = selectedBriefing.value.briefing_news_list.findIndex(
      (item) => item.group_no == group_no
    );

    if (groupIdx < 0) return;

    selectedBriefing.value.briefing_news_list[groupIdx].news_list.push(
      new NewListItem({
        news_title: report.title,
        pub_date: report.date,
        press_name: report.media,
        original_link: report.url,
      })
    );
  };
  return {
    briefingList,
    selectedBriefing,
    isEditable,
    editorConfig,
    filterObj,
    tempData,
    pagenation,
    saveNewsDateFilter,
    saveNewsGroups,
    selectedSearchDays,

    handleUpdateDatePicker,
    handleSearchDay,
    fetchSaveNewsList,
    openPreviewPage,
    fetchBriefingList,
    fetchBriefingInfo,
    handleDistributeClick,
    initSelectedData,
    submit,
    handleDeleteDistibute,
    initFilter,
    refreshList,
    changeDateType,
    handleNewsClick,
    selectedBrefingAddReport,
  };
};
