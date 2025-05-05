function withCors(response) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }
  
  export default {
    async fetch(request, env, ctx) {
      const { method } = request;
      const url = new URL(request.url);
      const path = url.pathname;
  
      if (method === 'OPTIONS') {
        return withCors(new Response(null, { status: 204 }));
      }
  
      if (path === "/api/status" && method === "GET") {
        const result = await env.DB.prepare(
          "SELECT name, status FROM users WHERE date = CURRENT_DATE"
        ).all();
  
        return withCors(new Response(JSON.stringify(result.results), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }
  
      if (path === "/api/update" && method === "POST") {
        try {
          const { name, status } = await request.json();
          await env.DB.prepare(
            `INSERT INTO users (name, status, date)
            VALUES (?, ?, CURRENT_DATE)
            ON CONFLICT(name, date) DO UPDATE SET status = excluded.status`
          ).bind(name, status).run();
  
          return withCors(new Response("OK", { status: 200 }));
        } catch (err) {
          return withCors(new Response("Invalid request", { status: 400 }));
        }
      }
  
      return withCors(await fetch("https://status-board-7t5.pages.dev"));
    }}
