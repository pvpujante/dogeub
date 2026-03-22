// API endpoint for search results using DuckDuckGo
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q, type } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  try {
    // Web search
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    const html = await response.text();
    const results = [];
    
    // Split by result blocks for more reliable parsing
    const resultBlocks = html.split(/<div[^>]*class="[^"]*result[^"]*links_main[^"]*"[^>]*>/g);
    
    for (let i = 1; i < resultBlocks.length && results.length < 15; i++) {
      const block = resultBlocks[i];
      
      // Extract link and title
      const linkMatch = block.match(/<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
      const snippetMatch = block.match(/<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/);
      
      if (!linkMatch) continue;
      
      let url = linkMatch[1];
      // DuckDuckGo redirects - extract real URL
      if (url.includes('uddg=')) {
        const uddgMatch = url.match(/uddg=([^&]*)/);
        if (uddgMatch) {
          url = decodeURIComponent(uddgMatch[1]);
        }
      }
      
      const title = linkMatch[2].replace(/<[^>]*>/g, '').trim();
      const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : '';
      
      let domain = '';
      try {
        domain = new URL(url).hostname.replace(/^www\./, '');
      } catch {}
      
      if (url && title && url.startsWith('http')) {
        results.push({
          title,
          url,
          snippet,
          favicon: domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null,
          domain
        });
      }
    }

    // Fallback parsing if the above doesn't work
    if (results.length === 0) {
      const simpleRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
      const snippetRegex = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
      
      const links = [...html.matchAll(simpleRegex)];
      const snippets = [...html.matchAll(snippetRegex)];
      
      for (let i = 0; i < Math.min(links.length, 15); i++) {
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
          domain = new URL(url).hostname.replace(/^www\./, '');
        } catch {}
        
        if (url && title && url.startsWith('http')) {
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
