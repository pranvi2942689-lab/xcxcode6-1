const dataService = require("./dataService");
const { AppError } = require("../utils/errors");
const { paginate } = require("../utils/pagination");

async function listContents(query = {}) {
  let contents = await dataService.read("contents", []);
  if (query.type) {
    contents = contents.filter((item) => item.type === query.type);
  }
  if (query.publishedOnly !== "false") {
    contents = contents.filter((item) => item.isPublished !== false);
  }
  contents = contents.sort((a, b) => {
    if ((a.sort || 0) !== (b.sort || 0)) {
      return (a.sort || 0) - (b.sort || 0);
    }
    return String(b.publishAt || "").localeCompare(String(a.publishAt || ""));
  });
  return paginate(contents, query);
}

async function getContentDetail(id) {
  const contents = await dataService.read("contents", []);
  const item = contents.find((record) => record.id === id);
  if (!item) {
    throw new AppError("内容不存在", 404);
  }
  return item;
}

module.exports = {
  listContents,
  getContentDetail
};
