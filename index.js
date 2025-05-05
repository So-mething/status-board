export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/api/status") {
      const result = await env.DB.prepare(
        "SELECT name, status FROM users WHERE date = CURRENT_DATE"
      ).all();

      return Response.json(result.results);
    }

    if (path === "/api/update" && request.method === "POST") {
      const body = await request.json();
      await env.DB.prepare(`
        INSERT INTO users (name, status, date)
        VALUES (?, ?, CURRENT_DATE)
        ON CONFLICT(name, date) DO UPDATE SET status = excluded.status
      `).bind(body.name, body.status).run();

      return new Response("OK", { status: 200 });
    }

    return fetch("https://status-board-7t5.pages.dev/index.html");
  }
};
