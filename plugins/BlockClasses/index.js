var cheerio = require("cheerio");

var applyBlockquoteClass = function (page) {
  var $ = cheerio.load(page.content);

  // Loop through each blockquote found in the page content
  $("blockquote").each(function () {
    const blockquote = this;

    let addedClass = false;
    $(this)
      .find("p")
      .each(function () {
        var data = $(this).contents()[0].data;
        if (data) {
          var check = data.trim();

          if (check.startsWith("[") && check.endsWith("]")) {
            check = check.replace(/\[|\]/g, "");
            check.split(" ").forEach((bit) => {
              $(blockquote).addClass(bit);
              addedClass = true;
            });
            $(this).contents()[0].data = "";
          }
        }
      });
    if (addedClass) $(this).addClass("classedBlock");
  });

  page.content = $.html();

  return page;
};

module.exports = {
  // Map of hooks
  hooks: {
    page: function (page) {
      return applyBlockquoteClass(page);
    },
  },

  // Map of new blocks
  blocks: {},

  // Map of new filters
  filters: {},
};
