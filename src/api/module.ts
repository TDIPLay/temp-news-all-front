import { axiosService } from "@/api/index";

export class ModulesAPI {
  /**
   * 언론사 List 조회
   * * @returns {Promise<any>}
   */
  static async getPressList(): Promise<any> {
    try {
      const res = await axiosService.post(`/Modules/PressList`);
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
  /**
   * NewsTop5 뉴스 조회
   * * @returns {Promise<any>}
   */
  static async getTopNewsList(param: any): Promise<any> {
    try {
      const res = await axiosService.post(
        `/TopNews/TopNewsList`,
        param ?? undefined
      );
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
}
