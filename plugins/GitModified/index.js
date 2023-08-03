var cheerio = require("cheerio");
const exec = require("child_process").exec;

var logFmt = "Last modified by %aN on %as - %B - %h";
var editUrl = "";
var historyUrl = "";

var addModifiedBlock = function (page) {


  const cmd = `git log -1 --pretty='format:${logFmt}' ${page.rawPath};`

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
      }
      if (stderr) {
        console.log(stderr)
      }
      else {

        var $ = cheerio.load(page.content);

        footer = stdout;

        if (editUrl) footer += ` [<a href="${editUrl}${page.path}">edit this page</a>]`
        if (historyUrl) footer += ` [<a href="${historyUrl}${page.path}">page history</a>]`

        $('body')
          .append(`<blockquote>${footer}</blockquote>`);

        page.content = $.html();
      }

      resolve(page)
    })
  })

};

module.exports = {
  // Map of hooks
  hooks: {

    config: function (config) {

      var configBlock = config.pluginsConfig["gitmodified"];

      logFmt = configBlock.logFormat ?? logFmt;
      editUrl = configBlock.editUrlPrefix ?? editUrl;
      historyUrl = configBlock.historyUrlPrefix ?? historyUrl;

      return config;
    },

    page: function (page) {
      return this.output.name === "website"
        ? addModifiedBlock(page)
        : page;
    },
  },

  // Map of new blocks
  blocks: {},

  // Map of new filters
  filters: {},
};
