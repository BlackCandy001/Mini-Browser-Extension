document.addEventListener('DOMContentLoaded', () => {
  const settingBtn = document.getElementById('settingBtn');
  const browserFrame = document.getElementById('browserFrame');
  const browserView = document.getElementById('browserView');
  const settingsView = document.getElementById('settingsView');
  
  const urlInput = document.getElementById('urlInput');
  const saveBtn = document.getElementById('saveBtn');
  const statusMsg = document.getElementById('statusMsg');
  const backBtn = document.getElementById('backBtn');
  const urlListEl = document.getElementById('urlList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  // --- Dropdown Variables ---
  const dropdownToggle = document.getElementById('dropdownToggle');
  const pinnedDropdown = document.getElementById('pinnedDropdown');

  // State
  let savedUrls = []; // Dạng [{url: '...', pinned: false}]

  // Hàm load URL vào iframe
  function loadUrl(url) {
    if (!url) return;
    browserFrame.src = url;
  }

  // --- Logic Dropdown ---
  dropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Ngăn click lan ra ngoài
    dropdownToggle.classList.toggle('open');
    pinnedDropdown.classList.toggle('show');
  });

  // Tự động đóng Dropdown khi click ra ngoài
  document.addEventListener('click', (e) => {
    if (!pinnedDropdown.contains(e.target) && !dropdownToggle.contains(e.target)) {
      dropdownToggle.classList.remove('open');
      pinnedDropdown.classList.remove('show');
    }
  });

  // Load danh sách ghim vào Dropdown
  function renderDropdown() {
    pinnedDropdown.innerHTML = '';
    const pinnedUrls = savedUrls.filter(u => u.pinned);

    if (pinnedUrls.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'dropdown-empty';
      emptyDiv.textContent = 'Bạn chưa ghim trang nào (vào Settings để ghim ★)';
      pinnedDropdown.appendChild(emptyDiv);
      return;
    }

    pinnedUrls.forEach(item => {
      const dropItem = document.createElement('div');
      dropItem.className = 'dropdown-item';
      
      let domain = '';
      try { domain = new URL(item.url).hostname; } catch(e) {}

      const iconImg = document.createElement('img');
      iconImg.className = 'drop-icon';
      iconImg.src = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : '';
      iconImg.alt = '';

      const textSpan = document.createElement('span');
      textSpan.className = 'drop-text';
      textSpan.textContent = item.url;
      textSpan.title = item.url;

      dropItem.appendChild(iconImg);
      dropItem.appendChild(textSpan);

      dropItem.onclick = () => {
        urlInput.value = item.url;
        loadAndSaveUrl(item.url, false);
        switchView('browser');
        dropdownToggle.classList.remove('open');
        pinnedDropdown.classList.remove('show');
      };

      pinnedDropdown.appendChild(dropItem);
    });
  }

  // Sắp xếp danh sách mới
  function renderUrlList() {
    urlListEl.innerHTML = '';
    
    // Sort items: pinned chạy lên đầu, còn lại theo thứ tự thêm (mới nhất dồn lên trên)
    const sortedUrls = [...savedUrls].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0; // Cùng trạng thái pin thì giữ nguyên thứ tự List hiện tại
    });

    sortedUrls.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'url-item';
      
      // Lấy domain từ URL để tải favicon
      let domain = '';
      try {
        domain = new URL(item.url).hostname;
      } catch(e) {}

      // Tạo thẻ ảnh icon bằng API của Google
      const iconImg = document.createElement('img');
      iconImg.className = 'url-icon';
      iconImg.src = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : '';
      iconImg.alt = '';
      
      const a = document.createElement('span');
      a.className = 'url-text';
      a.textContent = item.url;
      a.title = item.url;
      a.onclick = () => {
        urlInput.value = item.url;
        loadAndSaveUrl(item.url, false);
        switchView('browser');
      };

      const pinBtn = document.createElement('button');
      pinBtn.className = `pin-btn ${item.pinned ? 'pinned' : ''}`;
      pinBtn.title = item.pinned ? 'Bỏ ghim' : 'Ghim lên đầu';
      pinBtn.innerHTML = item.pinned ? '★' : '☆';
      pinBtn.onclick = () => togglePin(item.url);

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.title = 'Xoá';
      delBtn.innerHTML = '✕';
      delBtn.onclick = () => removeUrl(item.url);

      li.appendChild(pinBtn);
      li.appendChild(iconImg);
      li.appendChild(a);
      li.appendChild(delBtn);
      urlListEl.appendChild(li);
    });
  }

  function saveStateToStorage() {
    chrome.storage.local.set({ urlHistory: savedUrls });
    renderUrlList();
    renderDropdown();
  }

  function togglePin(targetUrl) {
    const idx = savedUrls.findIndex(u => u.url === targetUrl);
    if (idx !== -1) {
      savedUrls[idx].pinned = !savedUrls[idx].pinned;
      saveStateToStorage();
    }
  }

  function removeUrl(targetUrl) {
    savedUrls = savedUrls.filter(u => u.url !== targetUrl);
    saveStateToStorage();
  }

  // Hàm lưu URL mới hoặc cập nhật URL cũ thành đưa lên đầu
  function loadAndSaveUrl(rawUrl, isNewSubmit = true) {
    let url = rawUrl.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    urlInput.value = url;

    if (isNewSubmit) {
       // Ktra xem URL đã tồn tại chưa
       const existingIdx = savedUrls.findIndex(u => u.url === url);
       if (existingIdx !== -1) {
         // Đưa lên đầu mảng nếu không bị ghim. Lấy ra và push vào index 0
         const item = savedUrls.splice(existingIdx, 1)[0];
         savedUrls.unshift(item); // insert at index 0
       } else {
         // Nếu chưa tồn tại thì tạo mới ở đầu ds
         savedUrls.unshift({ url: url, pinned: false });
       }
       saveStateToStorage();

       // Hiển thị msg popup
       statusMsg.classList.add('show');
       setTimeout(() => statusMsg.classList.remove('show'), 2000);
    }
    
    // Lưu URL đang hiển thị hiện tại vào variable riêng phòng khởi động app
    chrome.storage.local.set({ savedUrl: url });
    loadUrl(url);
  }

  // Restore từ Storage lúc Init
  chrome.storage.local.get(['savedUrl', 'urlHistory'], (result) => {
    if (result.urlHistory && Array.isArray(result.urlHistory)) {
      savedUrls = result.urlHistory;
      renderUrlList();
      renderDropdown();
    }
    
    if (result.savedUrl) {
      urlInput.value = result.savedUrl;
      loadUrl(result.savedUrl);
    }
  });

  // Chuyển view
  function switchView(viewName) {
    if (viewName === 'settings') {
      browserView.classList.remove('active');
      settingsView.classList.add('active');
      settingBtn.style.display = 'none';
      backBtn.style.display = 'flex';
    } else {
      settingsView.classList.remove('active');
      browserView.classList.add('active');
      backBtn.style.display = 'none';
      settingBtn.style.display = 'flex';
    }
  }

  settingBtn.addEventListener('click', () => switchView('settings'));
  backBtn.addEventListener('click', () => switchView('browser'));

  saveBtn.addEventListener('click', () => {
    loadAndSaveUrl(urlInput.value, true);
  });

  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveBtn.click();
  });

  clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn xoá toàn bộ lịch sử URL không?')) {
      savedUrls = [];
      saveStateToStorage();
    }
  });

  // --- Chức năng Xoá / Dán ---
  const clearInputBtn = document.getElementById('clearInputBtn');
  const pasteInputBtn = document.getElementById('pasteInputBtn');

  // Hàm check và cập nhật trạng thái hiển thị của nút "Xóa/X"
  function toggleClearBtn() {
    if (urlInput.value.trim().length > 0) {
      clearInputBtn.style.display = 'flex';
      pasteInputBtn.style.display = 'none'; // Ẩn dán khi đã có text
    } else {
      clearInputBtn.style.display = 'none';
      pasteInputBtn.style.display = 'flex';
    }
  }

  // Lắng nghe text thay đổi
  urlInput.addEventListener('input', toggleClearBtn);
  urlInput.addEventListener('change', toggleClearBtn);

  // Click nút Xoá rỗng (X)
  clearInputBtn.addEventListener('click', () => {
    urlInput.value = '';
    toggleClearBtn();
    urlInput.focus();
  });

  // Click nút dán (Paste)
  pasteInputBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // chèn text và thay luôn
        urlInput.value = text;
        toggleClearBtn();
        urlInput.focus();
      }
    } catch (err) {
      console.error('Không thể đọc Clipboard: ', err);
      alert('Trình duyệt chưa cấp quyền Copy/Paste, vui lòng nhập thủ công!');
    }
  });

  // Init view btn status
  setTimeout(toggleClearBtn, 100);

});
