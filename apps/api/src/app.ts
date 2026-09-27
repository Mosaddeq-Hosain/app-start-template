import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { notes } from "./db/schema";

type Bindings = {
  DB: D1Database;
};

const NoteSchema = z.object({
  id: z.number().int().openapi({ example: 1 }),
  body: z.string().openapi({ example: "Ship the first version" }),
  createdAt: z.string().openapi({ example: "2026-09-27 10:30:00" }),
}).openapi("Note");

const ErrorSchema = z.object({ error: z.string() }).openapi("Error");

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(createRoute({
  method: "get",
  path: "/api/health",
  tags: ["System"],
  responses: {
    200: {
      description: "Worker health",
      content: { "application/json": { schema: z.object({ status: z.literal("ok"), database: z.literal("connected") }) } },
    },
  },
}), (context) => context.json({ status: "ok" as const, database: "connected" as const }));

app.openapi(createRoute({
  method: "get",
  path: "/api/notes",
  tags: ["Notes"],
  responses: {
    200: {
      description: "All notes, newest first",
      content: { "application/json": { schema: z.array(NoteSchema) } },
    },
  },
}), async (context) => {
  const rows = await drizzle(context.env.DB).select().from(notes).orderBy(desc(notes.id));
  return context.json(rows);
});

app.openapi(createRoute({
  method: "post",
  path: "/api/notes",
  tags: ["Notes"],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: z.object({ body: z.string().trim().min(1).max(1000) }) } },
    },
  },
  responses: {
    201: {
      description: "Created note",
      content: { "application/json": { schema: NoteSchema } },
    },
    400: {
      description: "Invalid request",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
}), async (context) => {
  const { body } = context.req.valid("json");
  const database = drizzle(context.env.DB);
  const result = await database.insert(notes).values({ body }).returning({ id: notes.id });
  const created = result[0] && await database.select().from(notes).where(eq(notes.id, result[0].id)).get();
  if (!created) return context.json({ error: "Could not create note" }, 400);
  return context.json(created, 201);
});

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: { title: "Field Notes API", version: "1.0.0" },
});

app.get("/docs", apiReference({
  theme: "saturn",
  url: "/openapi.json",
  pageTitle: "Field Notes API",
}));

export { app };
