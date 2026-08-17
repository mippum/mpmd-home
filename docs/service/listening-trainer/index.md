---
description: 외우고 싶은 문구나 명상 문장을 원하는 횟수만큼 반복해서 들려주는 듣기 트레이너입니다. 한국어와 영어 문장을 구분해 각각 알맞은 목소리로 읽어줍니다.
---

# 듣기 트레이너


<div id="root"></div>

<script src="/assets/webs/libs/tailwind.umd.min.js"></script>

<script src="/assets/webs/libs/react.umd.js"></script>
<script src="/assets/webs/libs/react-dom.umd.js"></script>
<script src="/assets/webs/umds/listening-trainer/dist/index.umd.js"></script>

<script>
    const { ListeningTrainerPage } = window.ListeningTrainer;
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(React.createElement(ListeningTrainerPage));
</script>
