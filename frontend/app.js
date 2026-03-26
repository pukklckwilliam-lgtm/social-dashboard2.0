let mapping = JSON.parse(localStorage.getItem("mapping")) || {};

// 字段映射
const fieldMapping = {
  tiktok: { views: "浏览量", likes: "点赞量" },
  instagram: { views: "浏览量", likes: "赞" },
  facebook: { views: "观看量", likes: "心情" },
  youtube: { views: "观看次数", likes: null },
  x: { views: "View Count", likes: "Favorite Count" }
};

// 保存账号映射
function saveMapping() {
  const account = document.getElementById("account").value;
  const platform = document.getElementById("platform").value;
  const product = document.getElementById("product").value;

  const key = `${account}_${platform}`;
  mapping[key] = product;

  localStorage.setItem("mapping", JSON.stringify(mapping));

  alert("保存成功");
}

// 解析Excel
document.getElementById("fileInput").addEventListener("change", handleFile);

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (evt) {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    processData(json);
  };

  reader.readAsArrayBuffer(file);
}

// 数据处理
function processData(rows) {
  let result = {};

  rows.forEach(row => {
    const account = row["账号"] || row["账户账号"] || "unknown";
    const platform = detectPlatform(row);

    const key = `${account}_${platform}`;
    const product = mapping[key] || "未分类";

    const map = fieldMapping[platform] || {};

    const views = row[map.views] || 0;
    const likes = row[map.likes] || 0;

    if (!result[product]) {
      result[product] = { views: 0, likes: 0 };
    }

    result[product].views += Number(views);
    result[product].likes += Number(likes);
  });

  document.getElementById("output").innerText =
    JSON.stringify(result, null, 2);
}

// 平台识别（简单版）
function detectPlatform(row) {
  if (row["视频链接"]) return "tiktok";
  if (row["帖子类型"]) return "instagram";
  if (row["公共主页名称"]) return "facebook";
  if (row["观看次数"]) return "youtube";
  if (row["Tweet Url"]) return "x";
  return "unknown";
}
