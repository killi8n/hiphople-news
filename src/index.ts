import cheerio from 'cheerio'
import {
    HIPHOPLE_NEWS_KOREA_URL,
    HIPHOPLE_NEWS_WORLD_URL,
} from './lib/constants'
import { crawl } from './lib/crawl'

export interface HiphopleArticle {
    id?: string
    href?: string
    backgroundImage?: string
    title?: string
    date?: string
    view?: string
}

type WorldOrKorea = 'world' | 'korea'

const getURL = (type: WorldOrKorea) => {
    let url: string = ''
    switch (type) {
        case 'world':
            url = HIPHOPLE_NEWS_WORLD_URL
            break
        case 'korea':
            url = HIPHOPLE_NEWS_KOREA_URL
            break
        default:
            break
    }

    return url
}

export const getLatestHiphopleNews = async (type: WorldOrKorea) => {
    try {
        const result = await getHiphopleNews(type)
        if (!result) {
            return null
        }
        if (result.length > 0) {
            return result[0] as HiphopleArticle
        }
        return null
    } catch (e) {
        return null
    }
}

export const getHiphopleNews = async (type: WorldOrKorea) => {
    try {
        const url: string = getURL(type)
        const body = await crawl(url)
        const $ = cheerio.load(body, { xmlMode: true })
        const newsList = $('.clear.ab-webzine').find('.wz-item')
        const result = newsList
            .map((_, element) => {
                const inner = $(element).find(
                    '.wz-item-inner.clear.thumbnail-left'
                )
                const href = $(element)
                    .find('.ab-link')
                    .attr('href')
                    ?.toString()
                const thumbnailWrapper = inner
                    .find('.wz-item-thumbnail')
                    .find('.thumbwrap')

                const contentsWrapper = inner.find('.wz-item-content')
                const titleHeader = contentsWrapper.find('.wz-item-header')
                const title = titleHeader.find('a').find('span.title').text()

                const metaWrapper = inner.find('.wz-item-meta.oloi')
                const date = metaWrapper.find('span.date').text()
                const view = metaWrapper.find('span.view').children()
                return {
                    id: href?.split('/')[href?.split('/').length - 1],
                    href: `${url}${href}`,
                    backgroundImage: thumbnailWrapper
                        .children()
                        .css('background-image'),
                    title,
                    date,
                    view: $(view[1]).text(),
                }
            })
            .toArray() as HiphopleArticle[]

        return result
    } catch (e) {
        return null
    }
}
