export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const path = url.pathname;
  
      // CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }
  
      // GET /api/status
      if (path === '/api/status' && request.method === 'GET') {
        const result = await env.DB.prepare(
          'SELECT name, status FROM users WHERE date = CURRENT_DATE'
        ).all();
  
        return new Response(JSON.stringify(result.results), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
  
      // POST /api/update
      if (path === '/api/update' && request.method === 'POST') {
        const { name, status } = await request.json();
  
        await env.DB.prepare(`
          INSERT INTO users (name, status, date)
          VALUES (?, ?, CURRENT_DATE)
          ON CONFLICT(name, date) DO UPDATE SET status = excluded.status
        `).bind(name, status).run();
  
        return new Response('OK', {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
  
      // Fallback to static site
      return fetch('https://status-board-7t5.pages.dev', {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    },
  };
