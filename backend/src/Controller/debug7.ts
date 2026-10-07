import express from 'express';
import { z } from 'zod';
import dns from 'dns/promises';

const router = express.Router();

const leadSchema = z.object({
    email: z.string().email(),
    companyName: z.string(),
});

router.post('/api/leads', async (req, res) => {
    let TimeoutID
    try {
       

     const validation = leadSchema.safeParse(req.body);
     if (!validation.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validation.error.issues,
        });
      }

    // 2. Immediate Non-Blocking Response
    res.status(202).json({ message: "Lead queued for processing" });

    // --- ASYNC BACKGROUND WORKER ---
    const { email, companyName } = req.body; 
    
    const domain = email.split('@')[1];

    // 3. Pre-Flight DNS MX Check
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
        console.log("Bounce risk: No MX records found");
        //use try catch here
        return ;
    }
        const controller = new AbortController();
          TimeoutID=setTimeout(() => controller.abort(), 5000);
        const llmRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
            body: JSON.stringify({ prompt: `Enrich ${companyName}` }),
            signal:controller.signal
             
        },
        
    );
         
        const data = await llmRes.json();
        console.log("Lead enriched successfully!", data);
    } catch (error) {
        if(error instanceof z.ZodError){
            error.issues;
        }
        console.error("LLM timeout or failure:", error);
       
    }
    finally{
        clearTimeout(TimeoutID)
    }
});

export default router;