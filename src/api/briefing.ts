import { axiosService } from "@/api/index";

export class BriefingAPI {
  /**
   * 브리핑 등록
   * * @returns {Promise<any>}
   */
  static async createBriefing(params: any): Promise<any> {
    try {
      const res = await axiosService.post(`/Briefing/BriefingNewsProcess`, {
        ...params,
        division: "regist",
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 브리핑 수정
   * * @returns {Promise<any>}
   */
  static async updateBriefing(params: any): Promise<any> {
    try {
      const res = await axiosService.post(`/Briefing/BriefingNewsProcess`, {
        ...params,
        division: "modify",
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 브리핑 삭제
   * * @returns {Promise<any>}
   */
  static async deleteBriefing(briefing_no: string): Promise<any> {
    try {
      const res = await axiosService.post(`/Briefing/BriefingNewsProcess`, {
        division: "delete",
        briefing_no: Number(briefing_no),
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 보도 목록 조회
   * * @returns {Promise<any>}
   */
  static async getBriefing(): Promise<any> {
    try {
      const res = await axiosService.post(`/Briefing/BriefingNewsList`);

      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 보도 목록 조회
   * * @returns {Promise<any>}
   */
  static async getBriefingInfo(id: string): Promise<any> {
    try {
      const res = await axiosService.post(`/Briefing/BriefingNewsInfo`, {
        briefing_no: id,
      });

      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 보도 배포 조회
   * * @returns {Promise<any>}
   */
  static async getBriefingDistributeInfo(key: string): Promise<any> {
    try {
      const res = await axiosService.post(
        `/Briefing/BriefingNewsDistribute?key=${key}`
      );

      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 보도 메일 내보내기
   * * @returns {Promise<any>}
   */
  static async exportBriefingDistribute(
    briefing_no: string,
    email: string
  ): Promise<any> {
    try {
      const res = await axiosService.post(
        `/Briefing/BriefingNewsMailDistribute`,
        {
          briefing_no: briefing_no,
          email: email,
        }
      );

      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
}
