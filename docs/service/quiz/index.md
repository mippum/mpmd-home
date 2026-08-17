---
description: 한 문제씩 답을 확인하며 푸는 퀴즈입니다. 맞춤법, 세계 수도, 영어 시제 문법 등 준비된 문제로 바로 시작할 수 있습니다.
---

# 퀴즈

<script src="/assets/webs/libs/tailwind.umd.min.js"></script>

<style>
  .MuiPagination-root ul {
  display: flex !important;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  margin: 0;
  list-style: none !important;
  gap: 6px;
}
.MuiPagination-root li {
  margin: 0 !important;
  padding: 0;
}
</style>

<div id="root"></div>

<script src="/assets/webs/libs/emotion.umd.min.js"></script>
<script src="/assets/webs/libs/react.umd.js"></script>
<script src="/assets/webs/libs/react-dom.umd.js"></script>
<script src="/assets/webs/umds/quiz/dist/index.umd.js"></script>

<script>
    const { QuizPage } = window.Quiz;
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(React.createElement(QuizPage));
</script>
