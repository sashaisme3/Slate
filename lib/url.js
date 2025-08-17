function URL(ctx, curl) {
  return {
    encode(url, context) {
      try {
        url = url.toString()
        url = (typeof window == 'object' ? url.replace(location.hostname, $Rhodium.location.hostname) : url)
        if (url.match(/^(data:|about:|javascript:|blob:)/g)) return url;
        else if (url.startsWith('./')) url = url.splice(2);
        if (url.startsWith(ctx.prefix)) return url
        
        // Check if this is an absolute URL with a pathname that already contains the proxy prefix
        try {
          const urlObj = new URL(url);
          if (urlObj.pathname && urlObj.pathname.includes(ctx.prefix)) {
            // Extract the proxied URL from the pathname and decode it
            const prefixIndex = urlObj.pathname.indexOf(ctx.prefix);
            const proxiedPath = urlObj.pathname.substring(prefixIndex + ctx.prefix.length);
            const decodedUrl = ctx.encoding.decode(proxiedPath);
            url = decodedUrl;
          }
        } catch (e) {
          // If URL parsing fails, continue with original logic
        }
        
        url = url.replace(/^\/\//g, 'https://')
        const validProtocol = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ws://') || url.startsWith('wss://');
        if (!context.Url.origin.endsWith('/') && !url.startsWith('/') && !url.startsWith('http:') && !url.startsWith('https:')) {
          url = '/'+url
        }
        var rewritten = ctx.prefix + ctx.encoding.encode(validProtocol ? url : context.Url.origin + url);
        if (context.clientRequest.headers['x-replit-user-id']=='') rewritten = rewritten.replace('https://', 'https:/')
        //throw new Error('');
        return rewritten.replace('http:', 'https:');
      } catch {
        return url
      }
    },
    decode(url) {
      return ctx.encoding.decode(url.replace(ctx.prefix, ''))
    }
  }
}

module.exports = URL