document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const saveBtn = document.getElementById('saveBtn');
  const statusMsg = document.getElementById('statusMsg');

  // Khôi phục URL đã lưu trước đó
  chrome.storage.local.get(['savedUrl'], (result) => {
    if (result.savedUrl) {
      urlInput.value = result.savedUrl;
    }
  });

  // Sự kiện khi nhấn nút Lưu
  saveBtn.addEventListener('click', () => {
    let url = urlInput.value.trim();
    
    if (url) {
      // Tự động thêm https:// nếu thiếu
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        urlInput.value = url;
      }
      
      // Lưu vào storage
      chrome.storage.local.set({ savedUrl: url }, () => {
        // Hiển thị thông báo đã lưu
        statusMsg.classList.add('show');
        setTimeout(() => {
          statusMsg.classList.remove('show');
        }, 2000);
      });
    }
  });

  // Hỗ trợ nhấn Enter để lưu
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });
});
