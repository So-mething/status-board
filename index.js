export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/api/status") {
      const result = await env.DB.prepare("SELECT name, status FROM users WHERE date = CURRENT_DATE").all();
      return Response.json(result.results);
    }

    if (pathname === "/api/update" && request.method === "POST") {
      const { name, status } = await request.json();
      await env.DB.prepare(`
        INSERT INTO users (name, status, date)
        VALUES (?, ?, CURRENT_DATE)
        ON CONFLICT(name, date) DO UPDATE SET status = excluded.status
      `).bind(name, status).run();
      return new Response("OK", { status: 200 });
    }

    // Serve static HTML fallback
    const html = await fetch("https://your-static-hosting-url/index.html");
    return new Response(await html.text(), { headers: { "Content-Type": "text/html" } });
  },
};
