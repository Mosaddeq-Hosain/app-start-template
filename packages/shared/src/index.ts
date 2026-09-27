export type HealthResponse = {
  status: "ok";
  database: "connected";
};

export type Note = {
  id: number;
  body: string;
  createdAt: string;
};
