// 좌측 메뉴 목록
export const menuItems = [
  {
    id: 1,
    label: "menu_items_txt.monitoring.text",
    icon: "bx-desktop",
    link: "/monitoring",
  },
  {
    id: 2,
    label: "menu_items_txt.save_news.text",
    icon: "bx-bookmark",
    link: "/save-news",
  },
  {
    id: 3,
    label: "menu_items_txt.briefing.text",
    icon: "bx-news",
    link: "/briefing",
  },
  {
    id: 4,
    label: "menu_items_txt.distribute.text",
    icon: "bx-mail-send",
    link: "/distribute",
  },
  {
    id: 5,
    label: "menu_items_txt.analyze.text",
    icon: "bx-line-chart",
    link: "/analyze",
    subItems: [
      {
        id: 6,
        label: "menu_items_txt.analyze.list.news",
        link: "/analyze-news",
        parentId: 5,
      },
      {
        id: 7,
        label: "menu_items_txt.analyze.list.trand",
        link: "/analyze-trand",
        parentId: 5,
      },
      {
        id: 8,
        label: "menu_items_txt.analyze.list.keyword",
        link: "/analyze-keyword",
        parentId: 5,
      },
    ],
  },
  {
    id: 9,
    label: "menu_items_txt.metavey.text",
    icon_url: require("@/assets/images/icon/metavey_icon.svg"),
    link: "/metavey",
  },
];
