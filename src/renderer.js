
// 这里可以写渲染进程的代码
console.log('Hello from renderer process!')
const inputSentence = document.getElementById('inputSentence');
const outputExplanation = document.getElementById('outputExplanation');

// 实时同步输入框内容到输出框
inputSentence.addEventListener('input', (event) => {
    const sentence = event.target.value;
    outputExplanation.value = sentence;
});

// 保持输出框为只读状态
outputExplanation.setAttribute('readonly', true);