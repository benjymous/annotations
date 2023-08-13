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

          const regex = /^\[(.+)\]/gm;

          const m = regex.exec(check);

          if (m) {
            const val = m[1];
            $(blockquote).addClass(val);
            $(this).contents()[0].data = data.replace(regex, "");
            addedClass = true;
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
