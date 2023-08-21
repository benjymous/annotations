var insertBlockLines = function (page) {
  var str = page.content;

  var result = str.replace(/^(\s*)>(.+)$/gm, "$&<br/>");

  page.content = result;

  return page;
};

module.exports = {
  // Map of hooks
  hooks: {
    "page:before": function (page) {
      return insertBlockLines(page);
    },
  },

  // Map of new blocks
  blocks: {},

  // Map of new filters
  filters: {},
};
