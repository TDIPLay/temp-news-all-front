<template>
  <div></div>
</template>
<script setup lang="ts">
import { useSessionStore } from "@/store/session";
import { useRoute, useRouter } from "vue-router";
import { ref, nextTick } from "vue";
const { user, attempt, snsLogin } = useSessionStore();
const route = useRoute();
const router = useRouter();

//id값을 받아온경우
let loginId = route.query.id ? String(route.query.id) : "";
const sId = JSON.parse(localStorage.getItem("user") ?? "");
if (!!sId && sId !== "undefind") {
  loginId = sId;
}

let loginType = route.query.type ? String(route.query.type) : "";
if (
  !!localStorage.getItem("type") &&
  localStorage.getItem("type") !== "undefind"
) {
  loginType = localStorage.getItem("type");
}

const params = {
  id: loginId,
  type: loginType,
};

if (loginId) {
  //토큰저장 후 홈으로 이동
  snsLogin(params).then((res) => {
    nextTick(() => {
      // console.log(res.result);
      if (res.result) {
        router.replace({ name: "monitoring" });
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("type");
        router.replace({ name: "main" });
      }
    });
  });
} else if (loginType) {
  console.log(route.query.type);
  location.href = `http://console.news-all.co.kr:8080/tdi/talk/v1/social/${route.query.type}`;
}
</script>
