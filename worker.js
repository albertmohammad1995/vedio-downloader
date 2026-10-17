export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get('url');

    if (!videoUrl) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Missing URL" 
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      const cobaltRes = await fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify({
          url: videoUrl,
          videoQuality: '720'
        })
      });

      const data = await cobaltRes.json();
      let directLink = null;

      if (data) {
        if (data.url) {
          directLink = data.url;
        } else if (data.picker && data.picker.length > 0) {
          directLink = data.picker[0].url;
        } else if (data.tunnel) {
          directLink = data.tunnel;
        }
      }

      if (directLink) {
        return new Response(JSON.stringify({
          success: true,
          download_url: directLink
        }), {
          headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*' 
          }
        });
      } else {
        return new Response(JSON.stringify({
          success: false,
          error: "Could not extract link",
          details: data
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          }
        });
      }

    } catch (err) {
      return new Response(JSON.stringify({
        success: false,
        error: err.message
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      });
    }
  }
};
