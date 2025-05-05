export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/api/status") {
      const result = await env.DB.prepare("SELECT id, name, status FROM users WHERE date = CURRENT_DATE").all();
      return new Response(JSON.stringify(result.results), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (pathname === "/api/update" && request.method === "POST") {
      const body = await request.json();
      await env.DB.prepare(`
        INSERT INTO users (name, status, date)
        VALUES (?, ?, CURRENT_DATE)
        ON CONFLICT(name, date) DO UPDATE SET status = excluded.status
      `).bind(body.name, body.status).run();
      return new Response("OK", { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  },
};
