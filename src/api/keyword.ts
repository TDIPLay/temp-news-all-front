import { axiosService } from "@/api/index";

export class KeywordAPI {
  /**
   * 뉴스 키워드 등록 (키워드 단어)
   * * @returns {Promise<any>}
   */
  static async createKeyWord(keyword: string, group_no: string): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordProcess`, {
        division: "regist",
        keyword: keyword,
        group_no: group_no,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 키워드 목록 조회
   * * @returns {Promise<any>}
   * group_no 없는경우 모든 키워드 반환
   */
  static async getKeyWords(group_no?: string): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordList`, {
        group_no: group_no,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 키워드 삭제
   * * @returns {Promise<any>}
   */
  static async deleteKeyWord(
    keyword_no: string,
    group_no?: string
  ): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordProcess`, {
        division: "delete",
        keyword_no: keyword_no,
        group_no: group_no,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 키워드 그룹 등록 (키워드 단어)
   * * @returns {Promise<any>}
   */
  static async createKeyWordGroup(param: any): Promise<any> {
    try {
      const res = await axiosService.post(
        `/KeyWord/KeyWordGroupProcess`,
        param
      );
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 키워드 그룹 수정
   * * @returns {Promise<any>}
   */
  static async updateKeyWordGroup(param: any): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordGroupProcess`, {
        division: "modify",

        ...param,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 키워드 그룹 목록 조회
   * * @returns {Promise<any>}
   */
  static async getKeyWordGroups(): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordGroupList`);
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 키워드 그룹 삭제
   * * @returns {Promise<any>}
   */
  static async deleteKeyWordGroup(group_no: string): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordGroupProcess`, {
        division: "delete",
        group_no: group_no,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 키워드 스크랩 실행 (최초 등록시 1회)
   * * @returns {Promise<any>}
   */
  static async scrapKeyWord(keyword: string): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordScrapRegist`, {
        keyword: keyword,
      });
      return true;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 키워드 스크랩
   * * @returns {Promise<any>}
   */
  static async fetchScrapKeyWord(params: any): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordScrapList`, {
        ...params,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 저장 뉴스 목록 조회
   * * @returns {Promise<any>}
   */
  static async fetchNewsSaveList(params: any): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordNewsSaveList`, {
        ...params,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 저장 뉴스
   * * @returns {Promise<any>}
   */
  static async createNewsSave(
    news_no: string | number,
    keyword: string
  ): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordNewsSaveProcess`, {
        division: "regist",
        news_no: news_no,
        keyword: keyword,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
  /**
   * 저장 뉴스  삭제
   * * @returns {Promise<any>}
   */
  static async deleteNewsSave(
    news_no: string | number,
    keyword: string
  ): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordNewsSaveProcess`, {
        division: "delete",
        news_no: news_no,
        keyword: keyword,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
  /**
   *
   * * @returns {Promise<any>}
   */
  static async fetchNewsRank(
    group_no: string | number,
    keyword_no: string[],
    start_date: string,
    end_date: string
  ): Promise<any> {
    try {
      const res = await axiosService.post(`/KeyWord/KeyWordNewsRank`, {
        group_no: group_no,
        keyword_no: keyword_no,
        start_date: start_date,
        end_date: end_date,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 팅서치 차트 데이터 조회
   * * @returns {Promise<any>}
   */
  static async fetchTrand(query: string): Promise<any> {
    try {
      const res = await axiosService.get(
        `http://console.news-all.co.kr/Trand/tdi/talk/v1/datalab?${query}`
      );
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
}
