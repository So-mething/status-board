export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (pathname === "/api/status") {
      const result = await env.DB.prepare("SELECT id, name, status FROM users WHERE date = CURRENT_DATE").all();
      return new Response(JSON.stringify(result.results), { headers: corsHeaders });
    }

    if (pathname === "/api/update" && request.method === "POST") {
      const body = await request.json();
      await env.DB.prepare(`
        INSERT INTO users (name, status, date)
        VALUES (?, ?, CURRENT_DATE)
        ON CONFLICT(name, date) DO UPDATE SET status = excluded.status
      `).bind(body.name, body.status).run();
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    // Serve static HTML
    if (pathname === "/" || pathname === "/index.html") {
      const html = await env.ASSETS.fetch(request);
      return new Response(html.body, { headers: { 'Content-Type': 'text/html' } });
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: corsHeaders });
  }
};
