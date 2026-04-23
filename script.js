const DELAY_MS = 6000;
const MAX_REPLIES = 10;

const balasan = [
  "Halo, ini nomor pengaduan Direktorat Siber Bareskrim. Ada yang bisa kami bantu?",
  "Baik, percakapan ini sudah kami rekam untuk keperluan investigasi. Mohon sebutkan nama lengkap Anda.",
  "Nomor Anda sudah kami catat. Tim kami sedang melacak lokasi pengirim pesan ini.",
  "Saya kebetulan pengacara spesialis penipuan digital. Boleh saya minta identitas Anda untuk keperluan somasi?",
  "Sudah saya screenshot dan laporkan ke aduanpenipuan.id. Nomor tiket: ADU-2024-88423",
  "Wah kebetulan! Saya justru sedang cari orang seperti Anda untuk kasus yang sedang saya tangani.",
  "Maaf bisa tunggu? Ada petugas di depan pintu mau ketuk. Sebentar ya...",
  "Anda yang tadi hubungi nomor 110 juga kan?",
  "Mohon tetap aktif di line ini, rekan kami dari unit siber sedang bergabung ke percakapan ini.",
  "Baik identitas Anda sudah terverifikasi. Kami akan lanjutkan proses sesuai prosedur hukum yang berlaku.",
];

let replyCount = 0;
let lastMsg = "";

function getRandomReply() {
  return balasan[Math.floor(Math.random() * balasan.length)];
}

function sendReply(text) {
  const inputBox = document.querySelector('[data-tab="10"] [contenteditable="true"]')
    || document.querySelector('footer [contenteditable="true"]');
  if (!inputBox) return;

  inputBox.focus();
  document.execCommand("insertText", false, text);
  inputBox.dispatchEvent(new InputEvent("input", { bubbles: true }));

  setTimeout(() => {
    const sendBtn = document.querySelector('[data-testid="send"]')
      || document.querySelector('[data-icon="send"]');
    if (sendBtn) sendBtn.click();
  }, 500);
}

const observer = new MutationObserver(() => {
  if (replyCount >= MAX_REPLIES) {
    observer.disconnect();
    return;
  }

  const msgs = document.querySelectorAll('[data-testid="msg-container"]');
  if (!msgs.length) return;

  const last = msgs[msgs.length - 1];
  const isIncoming = last.querySelector('[data-testid="msg-dblcheck"]') === null
    && last.querySelector('[data-testid="msg-check"]') === null;
  const msgText = last.innerText;

  if (isIncoming && msgText !== lastMsg) {
    lastMsg = msgText;
    replyCount++;
    setTimeout(() => sendReply(getRandomReply()), DELAY_MS);
  }
});

const chatArea = document.querySelector('#main') || document.body;
observer.observe(chatArea, { childList: true, subtree: true });
