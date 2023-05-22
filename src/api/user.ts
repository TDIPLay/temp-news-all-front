import { axiosService } from "@/api/index";

export class UserAPI {
  /**
   * 회원가입
   * * @returns {Promise<any>}
   */
  static async register(params: any): Promise<any> {
    try {
      const res = await axiosService.post(`/User/UserRegistProcess`, params);
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  // /**
  //  * 회원 정보 조회
  //  * * @returns {Promise<any>}
  //  */
  // static async getUserInfo(account_no: string | number): Promise<any> {
  //   try {
  //     const res = await axiosService.post(`/User/UserInfo`, {
  //       account_no: account_no,
  //     });
  //     return res && res.data ? res.data : undefined;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  /**
   * 회원 정보 조회
   * * @returns {Promise<any>}
   */
  static async getUserInfo(): Promise<any> {
    try {
      const res = await axiosService.post(`/User/UserInfo`);
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 회원 정보 수정
   * * @returns {Promise<any>}
   */
  static async updateUserInfo(params: any): Promise<any> {
    try {
      const res = await axiosService.post(`/User/UserProcess`, params);
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
  /**
   * 회원 알람 정보 조회
   * * @returns {Promise<any>}
   */
  static async getUserAlarmInfo(): Promise<any> {
    try {
      const res = await axiosService.post(`/User/UserAlarmInfo`);
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 회원 알람 등록
   * * @returns {Promise<any>}
   */
  static async createUserAlarmInfo(params: any): Promise<any> {
    try {
      const res = await axiosService.post(`/User/UserAlarmProcess`, params);
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }

  /**
   * 회원 알람 삭제
   * * @returns {Promise<any>}
   * * @ alarm_type : email = 1, kakao = 2
   */
  static async deleteUserAlarmInfo(alarm_type: string | number): Promise<any> {
    try {
      const res = await axiosService.post(`/User/UserAlarmProcess`, {
        division: "delete",
        alarm_type: alarm_type,
      });
      return res && res.data ? res.data : undefined;
    } catch (error) {
      return error;
    }
  }
}
