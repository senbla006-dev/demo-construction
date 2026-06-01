import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Prevent CORS issues during development
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    next();
  });

  // API route for estimate
  app.post("/api/estimate", async (req: any, res: any) => {
    try {
      const { projectType, scale, city, budget, customDetails } = req.body;

      if (!projectType || !scale || !city || !budget) {
        return res.status(400).json({ error: "Missing required project parameters." });
      }

      // Check if API key is present
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "" || apiKey.includes("PLACEHOLDER")) {
        console.warn("GEMINI_API_KEY is unconfigured. Returning premium fallback estimate.");
        return res.json(getFallbackEstimate(projectType, scale, city, budget, customDetails));
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const prompt = `You are the lead Principal Estimator and Structural Architect at BuildElite Construction, a high-end American commercial and master-developer firm.
Draft a highly professional, realistic, elite-tier construction project estimate proposal for a project with the following criteria:
- Project Type: ${projectType}
- Size/Scale: ${scale}
- Location: ${city}, United States
- Allocated Target Budget: ${budget}
- Client Custom Requests/Details: ${customDetails || "None provided"}

Be realistic, authoritative, and present realistic engineering advice, premium finishes, compliance concerns (e.g., HVAC, structural steel, foundation engineering), and high-quality US-grade construction standards. Return a detailed structural and financial breakdown in JSON matching the schema precisely.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectName: { type: Type.STRING, description: "Elegant, elite-sounding name for the construction project" },
              suggestedScope: { type: Type.STRING, description: "A detailed summary of the architectural scope, style, and engineering strategy" },
              estimatedCostRange: { type: Type.STRING, description: "Realistic cost breakdown, e.g., $15,000,000 - $18,500,000" },
              engineeringRequirements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key structural, civil, mechanical, and electrical engineering requirements"
              },
              materialsList: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Premium materials required (e.g. customized structural steel, smart glass façade, concrete formulations)"
              },
              estimatedDurationMonths: { type: Type.NUMBER, description: "Total duration in months" },
              riskMitigationAlerts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Potential local environmental, seismic, compliance, or structural risks and solutions"
              },
              projectPhases: {
                type: Type.ARRAY,
                description: "Step-by-step master schedule phases",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phaseName: { type: Type.STRING, description: "Phase title (e.g., Excavation & Shoring, Core Substructure)" },
                    description: { type: Type.STRING, description: "Details of this specific phase" },
                    durationWeeks: { type: Type.NUMBER, description: "Phase duration in weeks" },
                    percentageOfBudget: { type: Type.NUMBER, description: "Representative percentage of budget (integer 1-100)" }
                  },
                  required: ["phaseName", "description", "durationWeeks", "percentageOfBudget"]
                }
              }
            },
            required: [
              "projectName",
              "suggestedScope",
              "estimatedCostRange",
              "engineeringRequirements",
              "materialsList",
              "estimatedDurationMonths",
              "riskMitigationAlerts",
              "projectPhases"
            ]
          }
        }
      });

      const responseText = response.text ? response.text.trim() : "{}";
      const parsedData = JSON.parse(responseText);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini API estimation failure:", error);
      res.status(500).json({
        error: "Failed to generate AI Project estimate: " + error.message,
        fallbackData: getFallbackEstimate(req.body.projectType || "Commercial Development", req.body.scale || "Large Scale", req.body.city || "New York", req.body.budget || "$5,000,000", req.body.customDetails)
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BuildElite Server listening on http://localhost:${PORT}`);
  });
}

// Fallback generator for offline/unconfigured environments
function getFallbackEstimate(projectType: string, scale: string, city: string, budget: string, customDetails?: string) {
  return {
    projectName: `Elite ${projectType} Tower of ${city}`,
    suggestedScope: `A luxury, high-end ${scale.toLowerCase()} structure incorporating modern architectural steel structural grids, high-performance solar wind glass facades, and deep pile concrete foundations. The build is specialized for ${city}, optimizing construction flow and meeting stringent municipal code constraints.`,
    estimatedCostRange: `${budget} (Target Budget Fully Optimized)`,
    engineeringRequirements: [
      "Engineered deep pile foundation matched for local seismic zone activity and high load-bearing soils",
      "Advanced industrial steel framed column nodes and shear trusses for resistance to aerodynamic high-wind factors",
      "Dynamic commercial MEP systems leveraging automated ambient building heating, ventilation, and power storage",
      "Specialized high-capacity site drainage and subsoil storm-retention layouts"
    ],
    materialsList: [
      "Ultra-high-performance carbon composite reinforced concrete casting Mix",
      "Structural wide-flange beams with dynamic structural steel dampening nodes",
      "Triple-insulated solar low-emissivity glass panels with custom architectural copper trims",
      "High-grade architectural monolithic Italian basalt countertops and structural load-bearing timber columns"
    ],
    estimatedDurationMonths: 20,
    riskMitigationAlerts: [
      "Strict local noise bylaws require quiet phase planning during municipal hours.",
      "High subterranean moisture levels demand specialized initial sheet-piling and high-volume dewatering pumps.",
      "Urban structural logistics limit major daylight steel truss lifting. Mandatory off-site logistical sorting centers recommended."
    ],
    projectPhases: [
      {
        phaseName: "Civil Preparations & Shoring Piles",
        description: "Demolition of surface structures, ground engineering grading, and driving structural concrete support piles.",
        durationWeeks: 10,
        percentageOfBudget: 15
      },
      {
        phaseName: "Substructure & Core Foundations",
        description: "Basement structural slab casting, concrete reinforcements, and subterranean retaining walls completion.",
        durationWeeks: 12,
        percentageOfBudget: 25
      },
      {
        phaseName: "Superstructure Steel Framing",
        description: "Cranes crane-bolting structural columns, wide-flange trusses, horizontal steel decking installation.",
        durationWeeks: 16,
        percentageOfBudget: 30
      },
      {
        phaseName: "Curtain Enclosure & Dynamic Insulation",
        description: "Mounting perimeter high-performance glazing sheets and sealing modern weatherproofing roof grids.",
        durationWeeks: 10,
        percentageOfBudget: 20
      },
      {
        phaseName: "Fine Interior Finishes & Engineering Commissioning",
        description: "Drywall, premium fine stone & timber integrations, dynamic HVAC automation testing, and city inspector validation.",
        durationWeeks: 12,
        percentageOfBudget: 10
      }
    ]
  };
}

startServer();
