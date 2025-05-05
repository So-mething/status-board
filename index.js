function withCors(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }));
    }

    // GET /api/status
    if (path === '/api/status' && request.method === 'GET') {
      const result = await env.DB.prepare(
        'SELECT name, status FROM users WHERE date = CURRENT_DATE'
      ).all();
      return withCors(new Response(JSON.stringify(result.results), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }

    // POST /api/update
    if (path === '/api/update' && request.method === 'POST') {
      try {
        const { name, status } = await request.json();

        // Validate inputs
        if (!name || !status) {
          return withCors(new Response('Missing name or status', { status: 400 }));
        }

        await env.DB.prepare(
          `INSERT INTO users (name, status, date)
           VALUES (?, ?, CURRENT_DATE)
           ON CONFLICT(name, date) DO UPDATE SET status = excluded.status`
        ).bind(name, status).run();

        return withCors(new Response('OK', { status: 200 }));
      } catch (err) {
        return withCors(new Response(`Internal Error: ${err.message}`, { status: 500 }));
      }
    }

    // Fallback to static site
    return withCors(await fetch('https://status-board-7t5.pages.dev/index.html'));
  }
};
