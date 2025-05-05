export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/status") {
      const result = await env.DB.prepare(
        "SELECT id, name, status FROM users WHERE date = CURRENT_DATE"
      ).all();
      return new Response(JSON.stringify(result.results), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (pathname === "/" || pathname === "/index.html") {
      return new Response(env.INDEX_HTML, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};