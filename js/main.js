const openButton = document.getElementById('email-open');
// const openButton = document.querySelector("#email-open");
const closeButton = document.getElementById('email-close');
const emailPanel = document.getElementById('email-panel');
const toggleButton = document.getElementById('email-toggle');
const emailForm = document.querySelector("#email-form");
const sendButton = document.getElementById('email-send');

openButton.addEventListener("click", () => {
    emailPanel.classList.remove("minimized");
    emailPanel.querySelector(".email-panel-body").inert = false;
    toggleButton.ariaLabel = "minimize mail writing";
    // 패널 열기
    emailPanel.removeAttribute('hidden');
});

toggleButton.addEventListener("click", () => {
    const isMinimized = emailPanel.classList.toggle("minimized");
    emailPanel.querySelector(".email-panel-body").inert = isMinimized;
    toggleButton.ariaLabel = isMinimized ? "expand mail panel" : "minimize mail panel";
});

closeButton.addEventListener("click", () => {
    // 패널 닫기
    emailPanel.setAttribute('hidden', "");
    openButton.focus();
});

emailForm.addEventListener("submit", async (event) => {
    // 폼 제출 방지
    event.preventDefault();

    // 이메일 보내기
    const formData = new FormData(emailForm);
    const name = formData.get("name");
    const title = formData.get("title");
    const email = formData.get("email");
    const message = formData.get("message");

    const emailStatus = document.getElementById("email-status");
    emailStatus.textContent = "전송 중…";
    sendButton.disabled = true;
    try {
        const response = await fetch("https://pf-contact.snowforgeworks.workers.dev", {
            method: "POST",
            body: formData
        });
        const responseMsg = await response.text();
        console.log(response.status, responseMsg);
        if (response.ok) {
            emailStatus.textContent = "메일이 성공적으로 전송되었습니다.";
            emailForm.reset();
        } else {
            emailStatus.textContent = responseMsg || "메일 전송에 실패했습니다.";
        }
    }
    catch (error) {
        emailStatus.textContent = "메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
    }
    finally {
        sendButton.disabled = false;
    }

});