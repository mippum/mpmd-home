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
