const openButton = document.getElementById('email-open');
// const openButton = document.querySelector("#email-open");
const closeButton = document.getElementById('email-close');
const emailPanel = document.getElementById('email-panel');
const toggleButton = document.getElementById('email-toggle');
const emailForm = document.querySelector("#email-form");
const sendButton = document.getElementById('email-send');
let turnstileWidgetId;
const revealProjects = document.querySelectorAll(".t-stagger");

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        entry.target.classList.toggle("is-shown", entry.isIntersecting);
    });
}, {
    threshold: 0,
    rootMargin: "0px 0px -80px 0px"
});

revealProjects.forEach((project) => {
    project.classList.add("is-ready");
    revealObserver.observe(project);
});


openButton.addEventListener("click", () => {
    emailPanel.classList.remove("minimized");
    emailPanel.querySelector(".email-panel-body").inert = false;
    toggleButton.ariaLabel = "minimize mail writing";
    // 패널 열기
    emailPanel.removeAttribute('hidden');

    // 턴스타일 렌더링
    const emailTurnstileDiv = document.getElementById('email-turnstile');
    if (!turnstileWidgetId && emailTurnstileDiv) {
        turnstileWidgetId = turnstile.render('#email-turnstile', {
            sitekey: '0x4AAAAAAFUAD61yYwf4SIxE',
            callback: function (token) {
                console.log('CAPTCHA 통과됨:', token);
            },
            'expired-callback': function () {
                console.log('CAPTCHA 만료됨');
                turnstile.reset('#email-turnstile');
            }
        });
    }
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
        if (window.turnstile && turnstileWidgetId !== undefined) {
            turnstile.reset(turnstileWidgetId);
        }
    }
});
const sectionLinks = document.querySelectorAll(
    '.index-nav a[href^="#"]:not([href="#top"])'
);

const emailViewport = window.visualViewport;

function updateEmailViewport() {
    const height = emailViewport?.height ?? window.innerHeight;
    const offsetTop = emailViewport?.offsetTop ?? 0;
    const bottomGap = Math.max(
        0, window.innerHeight - height - offsetTop
    );

    emailPanel.style.setProperty("--email-visible-height", `${height}px`);
    emailPanel.style.setProperty("--email-bottom-gap", `${bottomGap}px`);
}

emailViewport?.addEventListener("resize", updateEmailViewport);
emailViewport?.addEventListener("scroll", updateEmailViewport);
window.addEventListener("resize", updateEmailViewport);
updateEmailViewport();


function updateActiveIndex() {
    let activeHref = "";

    sectionLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const section = document.querySelector(href);

        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.35) {
            activeHref = href;
        }
    });

    // 페이지 끝에서는 마지막 항목을 활성화
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        activeHref = sectionLinks[sectionLinks.length - 1]?.getAttribute("href") || "";
    }

    sectionLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === activeHref;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

window.addEventListener("scroll", updateActiveIndex, { passive: true });
window.addEventListener("resize", updateActiveIndex);
updateActiveIndex();

const indexNav = document.getElementById("idx-nav");

function updateIndexVisibility() {
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const isAtTop = window.scrollY < 100;
    const isAtBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

    indexNav.hidden = isAtTop || (isMobile && isAtBottom);
}

window.addEventListener("scroll", updateIndexVisibility, { passive: true });
window.addEventListener("resize", updateIndexVisibility);
updateIndexVisibility();