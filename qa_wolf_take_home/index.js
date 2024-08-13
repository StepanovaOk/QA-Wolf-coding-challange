const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const articles = await page.evaluate(() => {
    const articleElements = Array.from(
      document.querySelectorAll(".athing")
    ).slice(0, 100);
    return articleElements.map((article) => {
      const id = article.id;
      const timeElement = article.nextElementSibling.querySelector(".age a");
      const time = timeElement ? timeElement.getAttribute("title") : null;
      return { id, time };
    });
  });

  const isSorted = (articles) => {
    for (let i = 1; i < articles.length; i++) {
      if (new Date(articles[i - 1].time) < new Date(articles[i].time)) {
        return false;
      }
    }
    return true;
  };

  if (isSorted(articles)) {
    console.log("Articles are sorted correctly");
  } else {
    console.log("Articles are sorted incorrectly");
  }

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
