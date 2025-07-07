import { Actor } from 'apify';
import { CheerioCrawler, Dataset } from 'crawlee';

const enum Mode {
    BASIC = 'basic',
    FULL = 'full',
}

interface Input {
    newsletterUrls: {
        url: string;
        method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'OPTIONS' | 'CONNECT' | 'PATCH';
        headers?: Record<string, string>;
        userData: Record<string, unknown>;
    }[];
    mode: Mode;
}

interface Data {
    time: string;
    title: string;
    link: string;
    content?: Array<{ heading: string; text: string }>;
}

await Actor.init();

const SUPPORTED_NEWSLETTER_URLS = [{ url: 'https://news.smol.ai' }];
const { newsletterUrls = SUPPORTED_NEWSLETTER_URLS, mode = 'basic' } = (await Actor.getInput<Input>()) ?? ({} as Input);

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: async ({ $, log, request }) => {
        log.info(`Actor started with mode: ${mode}`);

        if (request.userData.label === Mode.FULL) {
            log.info('Full mode');
            const { title, time } = request.userData;
            const content: Data['content'] = [];

            $('article.content-area h1').each((_, el) => {
                const heading = $(el).text().trim();
                const text = $(el)
                    .nextUntil('h1')
                    .map((_, child) => $(child).text().trim())
                    .get()
                    .join('');

                content.push({ heading, text });
            });

            await Dataset.pushData({ title, time, content });
        } else {
            const data: Data[] = [];

            $('#timeline li').each((_index, element) => {
                const time = $(element).find('time').text().trim();
                const title = $(element).find('div.font-semibold').text().trim();
                const link = $(element).find('a').attr('href') ?? '';
                data.push({ time, title, link });
            });

            if (mode === Mode.FULL) {
                data.forEach(({ link, title, time }) => {
                    if (link) {
                        log.info(`Enqueuing link: ${link}`);
                        crawler.addRequests([
                            { url: `https://news.smol.ai${link}`, userData: { label: Mode.FULL, title, time } },
                        ]);
                    }
                });
            } else {
                const pushPromises = data.map(({ time, title }) => Dataset.pushData({ time, title }));
                await Promise.allSettled(pushPromises);
            }
        }
    },
});

await crawler.run(newsletterUrls);

await Actor.exit();
