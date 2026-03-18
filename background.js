// Cho phép mở side panel khi click vào icon extension trên thanh công cụ
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Định nghĩa rule nâng cao để vượt tường lửa chặn iframe mạnh hơn (dùng cho các trang email, AI, web lớn)
const bypassIframeRules = [
  {
    id: 1,
    priority: 1,
    action: {
      type: "modifyHeaders",
      responseHeaders: [
        { header: "X-Frame-Options", operation: "remove" },
        { header: "Content-Security-Policy", operation: "remove" },
        { header: "Frame-Options", operation: "remove" },
        { header: "Cross-Origin-Embedder-Policy", operation: "remove" },
        { header: "Cross-Origin-Opener-Policy", operation: "remove" },
        { header: "Cross-Origin-Resource-Policy", operation: "remove" },
        { header: "Document-Policy", operation: "remove" }, // Các policy khác
        { header: "Permissions-Policy", operation: "remove" }, 
        // Thêm CORS để cho phép nhúng từ mọi nguồn
        { header: "Access-Control-Allow-Origin", operation: "set", value: "*" },
        { header: "Access-Control-Allow-Methods", operation: "set", value: "*" },
        { header: "Access-Control-Allow-Headers", operation: "set", value: "*" }
      ],
      requestHeaders: [
        // Gỡ bỏ các header nhận diện frame/fetch để lách luật
        { header: "Sec-Fetch-Site", operation: "remove" },
        { header: "Sec-Fetch-Mode", operation: "remove" },
        { header: "Sec-Fetch-Dest", operation: "remove" },
        { header: "Sec-Fetch-User", operation: "remove" },
        // Giả lập User-Agent
        { header: "User-Agent", operation: "set", value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
      ]
    },
    condition: {
      urlFilter: "*",
      resourceTypes: ["sub_frame", "main_frame", "xmlhttprequest", "script", "stylesheet", "image"],
      tabIds: [-1] // tabId -1 áp dụng cho các cửa sổ không phải là tab (như side panel)
    }
  }
];

// Cập nhật rule ngay khi phiên làm việc chạy để hỗ trợ tabIds
function setupRules() {
  chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [1], // Xoá rule cũ (id: 1)
    addRules: bypassIframeRules
  });
}

// Chạy khi Browser hoặc Service Worker khởi động lại
chrome.runtime.onStartup.addListener(setupRules);
chrome.runtime.onInstalled.addListener(setupRules);

// Chạy lần đầu tiên lúc mã được nạp
setupRules();

