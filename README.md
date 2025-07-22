# AI News

An Apify Actor that scrapes AI newsletters, blog posts, and other content sources to create a centralized repository of AI news. The scraped content can be used to feed LLMs for summarization or read directly.

## Features

- **Automated scraping** of AI news from multiple sources
- **Structured data output** with title, date, and content sections
- **Dataset schema** for easy integration with LLMs and data processing tools
- **Scalable architecture** built on Apify platform

## Supported News Sources

### Currently Active
- [news.smol.ai](https://news.smol.ai/) - AI news and updates

### Planned Sources
- [latent.space](https://www.latent.space/) - AI community and research
- [Hugging Face Blog](https://huggingface.co/blog) - AI model releases and tutorials

## Output Format

The Actor produces structured data with the following fields:
- **title**: Main headline of the news summary
- **time**: Publication date (e.g., "Jun 26")
- **content**: Array of content sections with headings and detailed text

## Use Cases

- **AI Research**: Feed content to LLMs for automated summarization
- **News Monitoring**: Track AI industry developments
- **Content Analysis**: Analyze trends in AI news coverage
- **Data Collection**: Build datasets for AI research projects

## Contributing

Have ideas for improvements, additional news sources, or other features? 

Feel free to reach out with suggestions!