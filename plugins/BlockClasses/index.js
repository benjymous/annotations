var cheerio = require("cheerio");

const regex = /^\[(.+)\]/gm;

var applyBlockquoteClass = function (page) {
  var $ = cheerio.load(page.content);

  // Loop through each blockquote found in the page content
  $("blockquote").each(function () {
    const blockquote = this;

    const replacement = $("<div></div>");

    let addedClass = false;
    let currentBlock = undefined;
    $(this)
      .children()
      .each(function () {
        const childElement = this;
        $(blockquote).remove(childElement);

        var data = $(childElement).contents()[0].data;

        let hadClass = false;

        if (data) {
          var check = data.trim();

          const m = regex.exec(check);
          if (m) {
            const newblock = $("<blockquote></blockquote>");
            newblock.addClass("classedBlock");

            currentBlock = newblock;

            $(childElement).wrap(newblock);

            $(replacement).append(newblock);

            const val = m[1];
            $(newblock).addClass(val);
            $(this).contents()[0].data = data.replace(regex, "");
            addedClass = true;
            hadClass = true;

            replacement.append(newblock);
          }
        }

        if (currentBlock && !hadClass) {
          currentBlock.append(childElement);
        }
      });
    if (addedClass) {
      $(blockquote).replaceWith(replacement);
    }
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
