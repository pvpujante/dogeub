// API endpoint for search results using DuckDuckGo
export default async function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  try {
    // Get search results from DuckDuckGo HTML (scraping approach)
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    const html = await response.text();
    
    // Parse the results from HTML
    const results = [];
    
    // Match result blocks - DuckDuckGo HTML version
    const resultRegex = /<a class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/a>/g;
    
    let match;
    while ((match = resultRegex.exec(html)) !== null && results.length < 10) {
      let url = match[1];
      // DuckDuckGo uses redirect URLs, extract the actual URL
      if (url.includes('uddg=')) {
        const uddgMatch = url.match(/uddg=([^&]*)/);
        if (uddgMatch) {
          url = decodeURIComponent(uddgMatch[1]);
        }
      }
      
      const title = match[2].replace(/<[^>]*>/g, '').trim();
      const snippet = match[3].replace(/<[^>]*>/g, '').trim();
      
      if (url && title) {
        // Extract domain for favicon
        let domain = '';
        try {
          domain = new URL(url).hostname;
        } catch {}
        
        results.push({
          title,
          url,
          snippet,
          favicon: domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null,
          domain
        });
      }
    }

    // Alternative parsing if the above doesn't work
    if (results.length === 0) {
      // Try simpler pattern
      const simpleRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
      const snippetRegex = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
      
      const links = [...html.matchAll(simpleRegex)];
      const snippets = [...html.matchAll(snippetRegex)];
      
      for (let i = 0; i < Math.min(links.length, 10); i++) {
        let url = links[i][1];
        if (url.includes('uddg=')) {
          const uddgMatch = url.match(/uddg=([^&]*)/);
          if (uddgMatch) {
            url = decodeURIComponent(uddgMatch[1]);
          }
        }
        
        const title = links[i][2].replace(/<[^>]*>/g, '').trim();
        const snippet = snippets[i] ? snippets[i][1].replace(/<[^>]*>/g, '').trim() : '';
        
        let domain = '';
        try {
          domain = new URL(url).hostname;
        } catch {}
        
        if (url && title && !url.startsWith('/')) {
          results.push({
            title,
            url,
            snippet,
            favicon: domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null,
            domain
          });
        }
      }
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json({ results, query: q });
    
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to fetch search results', message: error.message });
  }
}
