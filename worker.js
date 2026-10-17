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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: videoUrl,
          videoQuality: '720'
        })
      });

      const data = await cobaltRes.json();

      if (data && (data.url || data.picker)) {
        let directLink = data.url;
        if (!directLink && data.picker && data.picker.length > 0) {
          directLink = data.picker[0].url;
        }

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
          error: "Could not extract"
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
