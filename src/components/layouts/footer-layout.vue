<template>
  <footer class="footer">
    <b-container fluid>
      <b-row class="align-items-center">
        <div class="col-auto m-auto tex-left">
          <img src="@/assets/img/main_logo.png" class="main-logo" />
        </div>

        <div class="col-sm-auto">
          <div class="row m-0 text-start">
            <div class="col-12">주식회사 티디아이 플레이</div>
            <div class="col-auto">사업자번호 : 601-81-37139</div>
            <div class="col-auto">
              주소 : 서울특별시 서초구 서초대로64길 8, 4층
            </div>
            <div class="col-auto">©Jeongeum. All Rights Reserved.</div>
          </div>
        </div>
      </b-row>
    </b-container>
  </footer>
  <!-- end footer -->
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.footer {
  // position: relative;
  // left: 0;
  .main-logo {
    max-height: 45px;
  }
  height: auto;
}
</style>
