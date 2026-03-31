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
  
  // --- Theme Elements ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn.querySelector('.theme-icon');
  const themeText = themeToggleBtn.querySelector('.theme-text');

  // --- Split View Elements ---
  // --- Split View Elements ---
  const splitVBtn = document.getElementById('splitVBtn');
  const splitHBtn = document.getElementById('splitHBtn');
  const targetBtn = document.getElementById('targetBtn');
  const swapBtn = document.getElementById('swapBtn');
  const frame1Container = document.getElementById('frame1Container');
  const frame2Container = document.getElementById('frame2Container');
  const browserFrame2 = document.getElementById('browserFrame2');
  const resizer = document.getElementById('resizer');

  // --- Dropdown Variables ---
  const dropdownToggle = document.getElementById('dropdownToggle');
  const pinnedDropdown = document.getElementById('pinnedDropdown');
  const pinnedList = document.getElementById('pinnedList');

  // State
  let savedUrls = []; // Dạng [{url: '...', pinned: false}]
  let splitMode = null; // null, 'v', 'h'
  let activeTarget = 'top'; // 'top' hoặc 'bottom' (Tuong ung Left/Right trong mode H)

  // Hàm cập nhật vùng đang Active (Xanh highlight)
  function updateActiveUI(target) {
    activeTarget = target;
    const isV = splitMode === 'v';
    if (target === 'top') {
      frame1Container.classList.add('active');
      frame2Container.classList.remove('active');
      targetBtn.innerHTML = isV ? '🔼 Top' : '◀️ Left';
      targetBtn.className = 'icon-btn top';
      // Cập nhật lại giá trị ô nhập URL từ URL của frame 1
      chrome.storage.local.get('savedUrlTop', (res) => {
        if (res.savedUrlTop) urlInput.value = res.savedUrlTop;
        else urlInput.value = '';
        toggleClearBtn();
      });
    } else {
      frame1Container.classList.remove('active');
      frame2Container.classList.add('active');
      targetBtn.innerHTML = isV ? '🔽 Bottom' : '▶️ Right';
      targetBtn.className = 'icon-btn bottom';
      // Cập nhật lại giá trị ô nhập URL từ URL của frame 2
      chrome.storage.local.get('savedUrlBottom', (res) => {
        if (res.savedUrlBottom) urlInput.value = res.savedUrlBottom;
        else urlInput.value = '';
        toggleClearBtn();
      });
    }
  }

  // Hàm load URL vào iframe tương ứng
  function loadUrl(url, target = activeTarget) {
    if (!url) return;
    if (target === 'top') {
      browserFrame.src = url;
    } else {
      browserFrame2.src = url;
    }
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
    pinnedList.innerHTML = '';
    const pinnedUrls = savedUrls.filter(u => u.pinned);

    if (pinnedUrls.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'dropdown-empty';
      emptyDiv.textContent = 'Bạn chưa ghim trang nào (vào Settings để ghim ★)';
      pinnedList.appendChild(emptyDiv);
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

      pinnedList.appendChild(dropItem);
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
    
    // Lưu URL vào Storage cho đúng phần
    if (activeTarget === 'top') {
      chrome.storage.local.set({ savedUrlTop: url });
    } else {
      chrome.storage.local.set({ savedUrlBottom: url });
    }
    loadUrl(url);
  }

  // --- Theme Logic ---
  let currentTheme = 'light';

  function applyTheme(theme) {
    const html = document.documentElement;
    currentTheme = theme;

    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Chế độ Tối';
    } else {
      html.setAttribute('data-theme', 'light');
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Chế độ Sáng';
    }
    chrome.storage.local.set({ theme: theme });
  }

  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  // Restore từ Storage lúc Init
  chrome.storage.local.get(['savedUrlTop', 'savedUrlBottom', 'urlHistory', 'splitMode', 'splitRatioV', 'splitRatioH', 'theme'], (result) => {
    // Theme Init (Mặc định Sáng nếu chưa có)
    applyTheme(result.theme === 'dark' ? 'dark' : 'light');
    
    if (result.urlHistory && Array.isArray(result.urlHistory)) {
      savedUrls = result.urlHistory;
      renderUrlList();
      renderDropdown();
    }
    
    if (result.splitMode) {
      splitMode = result.splitMode;
      browserView.classList.add(splitMode === 'v' ? 'split-v-mode' : 'split-h-mode');
      if (splitMode === 'v') splitVBtn.classList.add('active');
      else splitHBtn.classList.add('active');
      targetBtn.style.display = 'flex';
      updateActiveUI(activeTarget); // Cap nhat nhãn nút
    }

    // Áp dụng tỷ lệ chia màn hình cũ
    if (splitMode === 'v' && result.splitRatioV) {
      frame1Container.style.height = `${result.splitRatioV}%`;
      frame1Container.style.width = '100%';
    } else if (splitMode === 'h' && result.splitRatioH) {
      frame1Container.style.width = `${result.splitRatioH}%`;
      frame1Container.style.height = '100%';
    }

    if (result.savedUrlTop) {
      loadUrl(result.savedUrlTop, 'top');
      if (activeTarget === 'top') urlInput.value = result.savedUrlTop;
    }

    if (result.savedUrlBottom) {
      loadUrl(result.savedUrlBottom, 'bottom');
      if (activeTarget === 'bottom') urlInput.value = result.savedUrlBottom;
    }
    
    // Nếu chưa có savedUrlTop (bản cũ chuyển sang hoặc mới cài), thử lấy savedUrl cũ
    if (!result.savedUrlTop) {
        chrome.storage.local.get('savedUrl', (old) => {
            if (old.savedUrl) {
                loadUrl(old.savedUrl, 'top');
                urlInput.value = old.savedUrl;
                chrome.storage.local.set({ savedUrlTop: old.savedUrl });
            }
        });
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

  // Logic Toggle Split Mode
  function toggleSplit(mode) {
    const prevMode = splitMode;
    
    // Xoá hết class cũ
    browserView.classList.remove('split-v-mode', 'split-h-mode');
    splitVBtn.classList.remove('active');
    splitHBtn.classList.remove('active');
    frame1Container.style.height = '';
    frame1Container.style.width = '';

    if (prevMode === mode) {
      // Tắt split
      splitMode = null;
      targetBtn.style.display = 'none';
      swapBtn.style.display = 'none';
      updateActiveUI('top');
    } else {
      // Bật split mode mới
      splitMode = mode;
      browserView.classList.add(mode === 'v' ? 'split-v-mode' : 'split-h-mode');
      if (mode === 'v') splitVBtn.classList.add('active');
      else splitHBtn.classList.add('active');
      targetBtn.style.display = 'flex';
      swapBtn.style.display = 'flex';
      
      // Load tỉ lệ cũ
      chrome.storage.local.get(['splitRatioV', 'splitRatioH'], (res) => {
        if (mode === 'v' && res.splitRatioV) frame1Container.style.height = `${res.splitRatioV}%`;
        if (mode === 'h' && res.splitRatioH) frame1Container.style.width = `${res.splitRatioH}%`;
      });

      updateActiveUI(activeTarget);
    }
    chrome.storage.local.set({ splitMode: splitMode });
  }

  splitVBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Giữ menu mở để người dùng nhấn tiếp
    toggleSplit('v');
  });
  splitHBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Giữ menu mở để người dùng nhấn tiếp
    toggleSplit('h');
  });

  // Logic Hoán đổi (Swap) kết hợp ngăn đóng menu
  swapBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chrome.storage.local.get(['savedUrlTop', 'savedUrlBottom'], (res) => {
      const urlTop = res.savedUrlTop || '';
      const urlBottom = res.savedUrlBottom || '';
      
      // Hoán đổi trong Storage
      chrome.storage.local.set({
        savedUrlTop: urlBottom,
        savedUrlBottom: urlTop
      });
      
      // Load lại vào Iframe
      loadUrl(urlBottom, 'top');
      loadUrl(urlTop, 'bottom');
      
      // Cập nhật lại UI Input của frame đang active
      updateActiveUI(activeTarget);
    });
  });
  // --- Logic Resizer (Kéo thả thay đổi độ cao) ---
  let isDragging = false;
  let rafId = null;

  resizer.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.body.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !splitMode) return;

    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      const containerRect = browserView.getBoundingClientRect();
      
      if (splitMode === 'v') {
        const relativeY = e.clientY - containerRect.top;
        let percentage = (relativeY / containerRect.height) * 100;
        if (percentage < 10) percentage = 10;
        if (percentage > 90) percentage = 90;
        frame1Container.style.height = `${percentage}%`;
      } else {
        const relativeX = e.clientX - containerRect.left;
        let percentage = (relativeX / containerRect.width) * 100;
        if (percentage < 10) percentage = 10;
        if (percentage > 90) percentage = 90;
        frame1Container.style.width = `${percentage}%`;
      }
    });
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove('dragging');
      if (rafId) cancelAnimationFrame(rafId);
      
      // Lưu tỷ lệ tương ứng
      if (splitMode === 'v') {
        const ratio = parseFloat(frame1Container.style.height);
        chrome.storage.local.set({ splitRatioV: ratio });
      } else if (splitMode === 'h') {
        const ratio = parseFloat(frame1Container.style.width);
        chrome.storage.local.set({ splitRatioH: ratio });
      }
    }
  });

  // Sự kiện chọn Target (Nút Toggle duy nhất)
  targetBtn.addEventListener('click', () => {
    const newTarget = activeTarget === 'top' ? 'bottom' : 'top';
    updateActiveUI(newTarget);
  });

  // Click vào iframe wrapper để tự động đổi target (tiện lợi)
  frame1Container.addEventListener('click', () => updateActiveUI('top'));
  frame2Container.addEventListener('click', () => updateActiveUI('bottom'));

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
