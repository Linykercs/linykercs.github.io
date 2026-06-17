(function () {
  const API = "https://clinica-production-3c98.up.railway.app/api";

  const css = `
.chatbot-widget{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:12px}
.chatbot-box{width:300px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);display:flex;flex-direction:column;overflow:hidden}
.chatbot-header{background:#ab9680;color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:600}
.chatbot-close{background:none;border:none;color:#fff;font-size:16px;cursor:pointer}
.chatbot-msgs{padding:16px;display:flex;flex-direction:column;gap:10px;max-height:260px;overflow-y:auto}
.chatbot-msg{font-size:13px;line-height:1.5;padding:10px 14px;border-radius:12px;max-width:85%}
.chatbot-msg.bot{background:#f5f0ea;color:#3a3028;align-self:flex-start;border-bottom-left-radius:4px}
.chatbot-msg.user{background:#ab9680;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.chatbot-input-row{display:flex;border-top:1px solid #e8e0d8}
.chatbot-input-row input{flex:1;border:none;padding:12px 14px;font-size:13px;outline:none;font-family:inherit}
.chatbot-input-row button{background:#ab9680;color:#fff;border:none;padding:0 16px;cursor:pointer;font-size:16px}
.chatbot-btn-fab{width:52px;height:52px;border-radius:50%;background:#ab9680;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,0.18);transition:transform 0.2s}
.chatbot-btn-fab:hover{transform:scale(1.08)}
.chatbot-btn-fab img{width:28px;height:28px;filter:brightness(0) invert(1)}
`;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const base = document.querySelector('script[src*="chatbot.js"]')
    ? document.querySelector('script[src*="chatbot.js"]').src.replace(/chatbot\.js.*/, "")
    : "";

  const widget = document.createElement("div");
  widget.className = "chatbot-widget";
  widget.innerHTML = `
    <div class="chatbot-box" id="chatbotBox" style="display:none">
      <div class="chatbot-header">
        <span>Assistente Virtual</span>
        <button onclick="toggleChat()" class="chatbot-close">&#x2715;</button>
      </div>
      <div class="chatbot-msgs" id="chatbotMsgs">
        <div class="chatbot-msg bot">Olá! Como posso te ajudar? Pergunte sobre horários, serviços ou agendamentos.</div>
      </div>
      <div class="chatbot-input-row">
        <input type="text" id="chatbotInput" placeholder="Digite sua pergunta..." onkeydown="if(event.key==='Enter') enviarMsg()"/>
        <button onclick="enviarMsg()">&#x27A4;</button>
      </div>
    </div>
    <button class="chatbot-btn-fab" onclick="toggleChat()" title="Assistente Virtual">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="3"/>
        <path d="M8 8V6a4 4 0 0 1 8 0v2"/>
        <circle cx="9" cy="14" r="1.2" fill="#fff" stroke="none"/>
        <circle cx="15" cy="14" r="1.2" fill="#fff" stroke="none"/>
        <path d="M9 17.5c.8.7 2 1 3 1s2.2-.3 3-1"/>
        <line x1="12" y1="3" x2="12" y2="5"/>
        <circle cx="12" cy="2.5" r="0.7" fill="#fff" stroke="none"/>
      </svg>
    </button>`;
  document.body.appendChild(widget);

  window.toggleChat = function () {
    const box = document.getElementById("chatbotBox");
    const open = box.style.display === "none";
    box.style.display = open ? "flex" : "none";
    box.style.flexDirection = "column";
    if (open) document.getElementById("chatbotInput").focus();
  };

  function addMsg(texto, tipo) {
    const msgs = document.getElementById("chatbotMsgs");
    const div = document.createElement("div");
    div.className = "chatbot-msg " + tipo;
    div.textContent = texto;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  window.enviarMsg = async function () {
    const input = document.getElementById("chatbotInput");
    const pergunta = input.value.trim();
    if (!pergunta) return;
    input.value = "";
    addMsg(pergunta, "user");
    const typing = addMsg("...", "bot");
    try {
      const res = await fetch(`${API}/chatbot?pergunta=${encodeURIComponent(pergunta)}`);
      const data = await res.json();
      typing.textContent = data.resposta || "Não entendi. Tente perguntar de outra forma.";
    } catch {
      typing.textContent = "Erro ao conectar. Tente novamente.";
    }
  };
})();
