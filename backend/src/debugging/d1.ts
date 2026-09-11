import express, { Request, Response } from "express";
import axios from "axios";
import { z } from "zod";

const app = express();
app.use(express.json());

const TaskSchema = z.object({
  companyName: z.string(),
  researchDepth: z.enum(["shallow", "deep"]),
});
 
// Upstream AI Research Tool Worker
async function fetchEnrichmentData(companyName: string, depth: string){
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  const response = await axios.post(
    "http://localhost:8080/v1/enrich",
    { company: companyName, depth },
    {
      signal: controller.signal,
      responseType: "stream",
    }
  );

  clearTimeout(timeoutId);
  return response.data;
}

// Ingress Stream Controller
app.post("/api/research", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");
      let stream;
  try {
    const payload = TaskSchema.parse(req.body);

      stream= await fetchEnrichmentData(payload.companyName, payload.researchDepth);

    stream.on("data", (chunk: Buffer) => {
      res.write(`data: ${chunk.toString()}\n\n`);
    });

    // Detached background task for audit logging
    new Promise((resolve, reject) => {
      if (payload.researchDepth === "deep") {
        throw new Error("Audit log database unavailable");
      }
      resolve(true);
    });

  } catch (error: any) {  
    console.error("Pipeline encountered error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    stream.destroy();
    res.end();
  }
});

app.listen(3000, () => console.log("Gateway listening on :3000"));