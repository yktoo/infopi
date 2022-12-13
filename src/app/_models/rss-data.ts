import { Attributes, TextNode } from './gen-types';

export interface RawRssItem {
    title: TextNode;
    description?: TextNode;
    link?: TextNode;
    guid?: {
        attr: Attributes;
        text: string;
    };
    pubDate?: TextNode;
}

export interface RawRssChannel {
    title: TextNode;
    description?: TextNode;
    link?: TextNode;
    image?: {
        url: TextNode;
        title?: TextNode;
        link?: TextNode;
    };
    generator?: TextNode;
    lastBuildDate?: TextNode;
    copyright?: TextNode;
    language?: TextNode;
    ttl?: TextNode;
    item: RawRssItem[];
}

export interface RawRssFeed {
    _declaration: {
        attr: Attributes;
    };
    rss: {
        attr: Attributes;
        channel: RawRssChannel;
    };
}

export interface NewsItem {
    readonly title:       string;
    readonly description: string;
    readonly lastUpdate?: Date;
}
