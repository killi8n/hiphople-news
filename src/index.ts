import cheerio from "cheerio";
import {
  HIPHOPLE_NEWS_KOREA_URL,
  HIPHOPLE_NEWS_WORLD_URL,
} from "./lib/constants";
import crawl from "./lib/crawl";

export const getHiphopleNews = async (type: "world" | "korea") => {
  try {
    let url: string = "";
    switch (type) {
      case "world":
        url = HIPHOPLE_NEWS_WORLD_URL;
        break;
      case "korea":
        url = HIPHOPLE_NEWS_KOREA_URL;
        break;
      default:
        break;
    }
    const body = await crawl(url);
    const $ = cheerio.load(body, { xmlMode: true });
    const newsList = $(".clear.ab-webzine").find(".wz-item");
    const result = newsList
      .map((index, element) => {
        const inner = $(element).find(
          ".wz-item-inner.clear.thumbnail-left",
        );
        const thumbnailWrapper = inner
          .find(".wz-item-thumbnail")
          .find(".thumbwrap");

        const contentsWrapper = inner.find(".wz-item-content");
        const titleHeader = contentsWrapper.find(".wz-item-header");
        const title = titleHeader.find("a").find("span.title").text();

        const metaWrapper = inner.find(".wz-item-meta.oloi");
        const date = metaWrapper.find("span.date").text();
        const view = metaWrapper.find("span.view").children();
        return {
          href: `${url}${
            $(element)
              .find(".ab-link")
              .attr("href")
              ?.toString()
          }`,
          backgroundImage: thumbnailWrapper
            .children()
            .css("background-image"),
          title,
          date,
          view: $(view[1]).text(),
        };
      })
      .toArray();

    return result;
  } catch (e) {
    return null;
  }
};
