import { axiosService } from "@/api/index";

export class DistributeAPI {
  /**
   * 뉴스 보도 등록
   * * @returns {Promise<any>}
   */
  static async createDistributeNews(formdata: FormData): Promise<any> {
    try {
      const temp = formdata;
      temp.append("division", "regist");

      const res = await axiosService.post(
        `/Distribute/DistributeNewsProcess`,
        temp,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 보도 수정
   * * @returns {Promise<any>}
   */
  static async updateDistributeNews(formdata: FormData): Promise<any> {
    try {
      const temp = formdata;
      temp.append("division", "modify");

      const res = await axiosService.post(
        `/Distribute/DistributeNewsProcess`,
        temp,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 뉴스 보도 상태 변경
   * * @returns {Promise<any>}
   */
  static async updateDistributeNewsStatus(
    dis_no: string | number,
    status: string
  ): Promise<any> {
    try {
      const res = await axiosService.post(`/Distribute/DistributeNewsProcess`, {
        division: "status_modify",
        dis_no: dis_no,
        status: status,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
  /**
   * 뉴스 보도 삭제
   * * @returns {Promise<any>}
   */
  static async deleteDistributeNews(dis_no: string | number): Promise<any> {
    try {
      const res = await axiosService.post(`/Distribute/DistributeNewsProcess`, {
        division: "delete",
        dis_no: dis_no,
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
  static async getDistributeNews(): Promise<any> {
    try {
      const res = await axiosService.post(`/Distribute/DistributeNewsList`);
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
}
