"use strict";

const chatButton = document.querySelector("#chat-button");
const chatText = document.querySelector("input");
const titleImage = document.querySelector("#title-image");
const title = document.querySelector("#title");

const chatContainer = document.querySelector("#chat-container");

const apiEndpoint = "https://api.openai.com/v1/chat/completions";
const api_key = "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";



//채팅 보내기 버튼 클릭시
chatButton.addEventListener("click", async (e) => {
  e.preventDefault();
  document.querySelector("#main-page").style.display = "none";
  chatContainer.style.visibility = "visible";
  chatContainer.style.opacity = "1";
  const message = chatText.value.trim();

  addMessage("user", message);

  //입력폼 초기화
  chatText.value = "";
  chatButton.querySelector("img").src = "./img/button.png";
  chatButton.style.pointerEvents = "none";
  chatButton.style.userSelect = "none";
  chatButton.disabled = true;

  //로딩중 표시 -> 없애도 됨
  const tempMessageElement = addTemporaryMessage();

  const aiResponse = await fetchAIResponse(message);

  // 임시 메시지 요소를 제거하고, 실제 응답으로 메시지 추가
  chatContainer.removeChild(tempMessageElement);
  addMessage("ai", aiResponse);
});




//openai api 호출 함수
async function fetchAIResponse(prompt) {
  const requestOptions = {
    method: "POST",

    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "저는 인공지능 챗봇입니다. 저의 이름은 'GDSC AI' 입니다. 저는 한글로만 대답합니다. 여러분의 질문에 답변을 드릴 수 있습니다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]
    }),
  };

  try {
    const response = await fetch(apiEndpoint, requestOptions);
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    return aiResponse;
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    return "OpenAI API 호출 중 오류 발생";
  }
}

//채팅을 화면에 add 하는 함수
const addMessage = (sender, message) => {
  const messageElement = document.createElement("div");
  const imgElement = document.createElement("img");
  const nameElement = document.createElement("div");
  const logElement = document.createElement("div");

  if (sender === "user") {
    messageElement.className = "chat my-chat";
    imgElement.src = "./img/user.png";
    nameElement.textContent = "You";
  } else if (sender === "ai") {
    messageElement.className = "chat gpt-chat";
    imgElement.src = "./img/logo.png";
    nameElement.textContent = "GDSC AI";
  }

  imgElement.className = "profile";
  nameElement.className = "chat-name";
  logElement.className = "chat-log";
  logElement.textContent = message;

  messageElement.appendChild(imgElement);
  messageElement.appendChild(nameElement);
  messageElement.appendChild(logElement);

  chatContainer.prepend(messageElement);
  messageElement.scrollIntoView();
};



//부가기능) 로딩중 표시 -> 없애도 됨
const addTemporaryMessage = () => {
  const tempMessageElement = document.createElement("div");
  tempMessageElement.className = "chat gpt-chat";
  const imgElement = document.createElement("img");
  imgElement.src = "./img/logo.png";
  imgElement.className = "profile";
  const nameElement = document.createElement("div");
  nameElement.textContent = "GDSC AI";
  nameElement.className = "chat-name";
  const logElement = document.createElement("div");
  logElement.className = "chat-log";
  const spinnerElement = document.createElement("img");
  spinnerElement.src = "./img/spinner.gif"; // 스피너 이미지 경로를 지정하세요
  spinnerElement.className = "spinner";

  logElement.appendChild(spinnerElement);
  tempMessageElement.appendChild(imgElement);
  tempMessageElement.appendChild(nameElement);
  tempMessageElement.appendChild(logElement);

  chatContainer.prepend(tempMessageElement);
  tempMessageElement.scrollIntoView();


  return tempMessageElement;
};

//부가기능2) section 클릭시 채팅창에 내용 추가 함수
document.querySelectorAll(".section").forEach((section) => {
  const title = section.querySelector(".section-title");
  const content = section.querySelector(".section-main");
  section.addEventListener("click", () => {
    chatText.value = title.textContent.trim() + " " + content.textContent.trim();
    chatButton.querySelector("img").src = "./img/button_active.png";
    chatButton.style.pointerEvents = "auto";
    chatButton.style.userSelect = "auto";
    chatButton.disabled = false;
  }
  );
});


//부가기능3) 입력 필드에 텍스트가 입력되면 버튼 활성화
chatText.addEventListener("input", async (e) => {
  if (chatText.value === "") {
    chatButton.querySelector("img").src = "./img/button.png";
    chatButton.style.pointerEvents = "none";
    chatButton.style.userSelect = "none";
    chatButton.disabled = true;
  }
  else {
    chatButton.querySelector("img").src = "./img/button_active.png";
    chatButton.style.pointerEvents = "auto";
    chatButton.style.userSelect = "auto";
    chatButton.disabled = false;
  }
});

