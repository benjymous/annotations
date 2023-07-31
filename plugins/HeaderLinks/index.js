var cheerio = require("cheerio");

var applyBlockquoteClass = function (page) {
  var $ = cheerio.load(page.content);

  // Loop through each h3 found in the page content
  $("h3").each(function () {
    const h3 = $(this);
    const id = h3.text().toLowerCase().replace(" ","-").replace(":","");
    //console.log(h3.text(), id)
    if (id.startsWith("page")) {
      h3.append(`<a class="header-link" href="#${id}">#</a>`);
    }
    h3.attr("id", id);
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
