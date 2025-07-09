// Load environment variables from .env file
require('dotenv').config();

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Declare transporter outside, but don't initialize yet
let transporter;

// The helloWorld test function has been removed as it's no longer needed

// Define a callable function named "submitFormData"
// The name is what you will use to call it from your frontend.
exports.submitFormData = functions.https.onCall(async (data, context) => {
  // Log the incoming data for debugging
  console.log("Form submission received with raw data:", data);
  console.log("Form submission data fields:", {
    name: data.name || "[Missing]",
    email: data.email || "[Missing]",
    subject: data.subject || "[No Subject]",
    messageLength: data.message ? data.message.length : 0,
    dataType: typeof data,
    hasDataProperty: data.data ? 'Yes' : 'No'
  });
  
  // Check if data is wrapped in a data property (Firebase callable functions format)
  if (data.data && typeof data.data === 'object') {
    console.log("Unwrapping data from data.data property");
    data = data.data;
  }

  // --- Validate the Input Data ---
  // Check if the required fields are present
  if (!data.name || !data.email || !data.message) {
    console.error("Missing required fields in form submission");
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Please provide name, email, and message."
    );
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.error("Invalid email format in form submission");
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Please provide a valid email address."
    );
  }

  // Initialize SendGrid with API key
  const initSendGrid = () => {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    
    if (!sendgridApiKey) {
      console.error("SendGrid API key is missing");
      return false;
    }
    
    // Set the API key for SendGrid
    sgMail.setApiKey(sendgridApiKey);
    return true;
  };

  // --- Process and Save the Data ---
  try {
    // Log detailed debugging information
    console.log("Function execution started with data:", JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject || "[No Subject]",
      messageLength: data.message ? data.message.length : 0
    }));
    
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const emailRecipient = process.env.EMAIL_RECIPIENT;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    
    console.log("Email config check:", {
      sendgridApiKeyExists: !!sendgridApiKey,
      toEmailExists: !!process.env.TO_EMAIL,
      fromEmailExists: !!process.env.FROM_EMAIL
    });

    // Try to save to Firestore if available, but don't block the form submission if it fails
    let firestoreSaveSuccessful = false;
    let docId = null;
    
    try {
      console.log("Attempting to save to Firestore...");
      const db = admin.firestore();
      
      // Define the data to be saved
      const formData = {
        name: data.name,
        email: data.email,
        subject: data.subject || "[No Subject]",
        message: data.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ipAddress: context.rawRequest?.ip || "Unknown",
        userAgent: context.rawRequest?.headers?.['user-agent'] || "Unknown"
      };
      
      // Save the data to Firestore
      const docRef = await db.collection("contactSubmissions").add(formData);
      docId = docRef.id;
      console.log(`Form data saved to Firestore with ID: ${docId}`);
      firestoreSaveSuccessful = true;
    } catch (firestoreError) {
      // Log the error but continue with the form submission
      console.error("Error saving to Firestore:", firestoreError);
      console.log("Continuing without saving to Firestore...");
    }

    // Now try to send the email using SendGrid
    const toEmail = process.env.TO_EMAIL || 'Saifalhail@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@devfolio.com';
    
    // Initialize SendGrid
    if (initSendGrid()) {
      try {
        console.log("Attempting to send email notification via SendGrid...");
        
        const msg = {
          to: toEmail,
          from: fromEmail,
          subject: `Contact Form: ${data.subject || 'New Message'}`,
          text: `
            Name: ${data.name}
            Email: ${data.email}
            Subject: ${data.subject || 'N/A'}
            Message: ${data.message}
          `,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
            <p><strong>Message:</strong> ${data.message}</p>
          `
        };
        
        await sgMail.send(msg);
        console.log("Email notification sent successfully via SendGrid");
      } catch (emailError) {
        // Log the email error but don't fail the function
        console.error("Error sending email notification:", emailError);
        console.log("Continuing without email notification");
      }
    } else {
      console.log("SendGrid configuration not found. Skipping email notification.");
    }

    // --- Send a Response Back to the Frontend ---
    let responseMessage = "Your form has been submitted successfully!";
    if (!firestoreSaveSuccessful) {
      responseMessage += " (Note: Your submission was not saved to our database, but we received your message)";
    }
    
    return {
      status: "success",
      message: responseMessage,
      docId: docId,
      emailSent: true,
      savedToDatabase: firestoreSaveSuccessful
    };
  } catch (error) {
    // Log detailed error information
    console.error("Error processing form submission:", error);
    console.error("Error stack trace:", error.stack);
    
    if (error.code) {
      console.error("Error code:", error.code);
    }
    
    if (error.details) {
      console.error("Error details:", error.details);
    }
    
    // Throw a more specific error with details
    throw new functions.https.HttpsError(
        "internal",
        `Form submission error: ${error.message || "Unknown error"}`,
        { errorDetails: error.toString() }
    );
  }
});

// Generate AI insights for project using Gemini API
exports.generateProjectInsights = functions
  .runWith({
    // Increase memory and timeout for AI processing
    memory: '1GB',
    timeoutSeconds: 120,
    // Add maxInstances to prevent scaling issues
    maxInstances: 10
  })
  .https.onCall(async (data, context) => {
  console.log("Generating project insights with Gemini API");
  
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to generate project insights"
    );
  }

  // Validate input
  if (!data.projectData || typeof data.projectData !== 'object') {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Project data is required"
    );
  }

  const projectData = data.projectData;
  
  // Check if Gemini API key is configured
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error("Gemini API key not configured");
    throw new functions.https.HttpsError(
      "failed-precondition",
      "AI service is not configured. Please contact support."
    );
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    
    // Use gemini-2.0-flash model (fast model without thinking mode)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 12000, // Increased for very comprehensive output
      }
    });

    // Create a comprehensive prompt with all project information
    const prompt = `You are an expert software project analyst and consultant working with a solo software developer. Analyze the following project details and provide COMPREHENSIVE insights in JSON format.

CONTEXT:
You are analyzing a project for a solo software developer who specializes in:
- Full-stack web development (React, Node.js, Firebase)
- Mobile applications (React Native, Flutter)
- Custom software solutions
- Modern tech stacks and cloud services
- Serving clients globally with high-quality, scalable solutions

IMPORTANT CONSIDERATIONS FOR YOUR ANALYSIS:
- Timeline estimates should be realistic for ONE developer
- Recommend cost-effective solutions suitable for startups/SMEs
- Prioritize maintainability and scalability
- Suggest phased approaches when appropriate
- Consider the developer's expertise with React/Firebase ecosystem
- Factor in time for testing, deployment, and client feedback
- Provide specific, actionable recommendations
- Include all technical details needed to start the project

PROJECT DETAILS:
- Project Name: ${projectData.projectName || 'Unnamed Project'}
- Industry: ${projectData.industry?.label || projectData.industry || 'Not specified'}
- Project Type: ${projectData.projectType || 'Not specified'}
- Description: ${projectData.projectDescription || 'No description provided'}
- Target Users: ${projectData.targetUsers || 'Not specified'}
- Geographic Locations: ${Array.isArray(projectData.geographicLocations) ? projectData.geographicLocations.map(loc => typeof loc === 'object' ? loc.label : loc).join(', ') : projectData.geographicLocations || 'Not specified'}
- Expected User Scale: ${projectData.expectedUserScale || 'Not specified'}
- Timeline: ${projectData.projectTimeline || 'Not specified'}
- Budget Range: ${projectData.budgetRange || 'Not specified'}
- Key Features: ${projectData.keyFeatures?.join(', ') || 'No features specified'}
- Platforms: ${projectData.platforms?.join(', ') || 'Not specified'}
- Tech Stack Preference: ${projectData.techStack || 'Not specified'}
- Hosting Preference: ${projectData.hosting || 'Not specified'}
- Design Preferences: ${projectData.designPreferences?.join(', ') || 'No preferences specified'}
- Authentication Methods: ${projectData.authenticationMethods?.join(', ') || 'Not specified'}
- Data Storage Features: ${projectData.dataStorageFeatures?.join(', ') || 'Not specified'}
- Third-party Integrations: ${projectData.thirdPartyIntegrations?.join(', ') || 'None specified'}
- Existing Resources: ${projectData.existingResources?.join(', ') || 'None'}
- Existing Materials: ${projectData.existingMaterials?.join(', ') || 'None'}
- Competitor URLs: ${projectData.competitorUrls?.join(', ') || 'None provided'}
- Additional Notes: ${projectData.additionalNotes || 'None'}

Please provide an EXTREMELY COMPREHENSIVE analysis in the following JSON format. Fill ALL fields with detailed, specific information:

{
  "executiveSummary": "A comprehensive 3-4 sentence overview of the project, its market opportunity, technical approach, and expected outcomes",
  
  "projectFeasibility": {
    "score": "1-10 score with decimal precision (e.g., 8.5)",
    "assessment": "Detailed assessment of technical and business feasibility (2-3 sentences)",
    "keyConsiderations": ["List of 5-7 specific key points to consider for project success"]
  },
  
  "technicalRecommendations": {
    "suggestedTechStack": {
      "frontend": ["List 3-5 specific frontend technologies with versions"],
      "backend": ["List 3-5 specific backend technologies with versions"],
      "database": ["List 2-3 database solutions with use cases"],
      "hosting": ["List 2-3 hosting platforms with specific services"]
    },
    "architecturePattern": "Detailed architecture recommendation with justification",
    "scalabilityConsiderations": ["List of 4-5 specific scalability strategies"]
  },
  
  "technicalSpecification": {
    "architecture": "Detailed architecture description (e.g., 'Microservices with API Gateway')",
    "databases": {
      "primary": "Primary database choice with reason",
      "cache": "Caching solution if needed",
      "search": "Search database if needed"
    },
    "apiDesign": "API design approach (REST, GraphQL, etc.) with rationale",
    "deploymentArchitecture": "Detailed deployment strategy"
  },
  
  "timelineEstimate": {
    "totalDuration": "Specific duration (e.g., '16-20 weeks')",
    "phases": [
      {
        "name": "Phase 1: Planning & Setup",
        "duration": "1-2 weeks",
        "deliverables": ["List 3-4 specific deliverables"]
      },
      {
        "name": "Phase 2: Core Development",
        "duration": "Duration",
        "deliverables": ["List specific deliverables"]
      },
      {
        "name": "Phase 3: Testing & Refinement",
        "duration": "Duration",
        "deliverables": ["List specific deliverables"]
      },
      {
        "name": "Phase 4: Deployment & Launch",
        "duration": "Duration",
        "deliverables": ["List specific deliverables"]
      }
    ],
    "criticalMilestones": ["List of 5-6 specific, measurable milestones"]
  },
  
  "projectRoadmap": {
    "phases": [
      {
        "phase": "Foundation (Weeks 1-3)",
        "duration": "3 weeks",
        "tasks": ["List 5-7 specific tasks"],
        "deliverables": ["List 3-4 deliverables"],
        "dependencies": ["List any dependencies"]
      },
      {
        "phase": "MVP Development (Weeks 4-8)",
        "duration": "5 weeks",
        "tasks": ["List specific development tasks"],
        "deliverables": ["List deliverables"],
        "dependencies": ["List dependencies"]
      },
      {
        "phase": "Enhancement & Polish (Weeks 9-12)",
        "duration": "4 weeks",
        "tasks": ["List enhancement tasks"],
        "deliverables": ["List deliverables"]
      }
    ]
  },
  
  "budgetAnalysis": {
    "estimatedCost": "Specific range (e.g., '$15,000 - $25,000')",
    "costBreakdown": {
      "development": "60-70% ($12,000-$17,500)",
      "design": "15-20% ($3,000-$5,000)",
      "testing": "10% ($1,500-$2,500)",
      "deployment": "5% ($750-$1,250)",
      "maintenance": "$500-$1,000/month for first year"
    },
    "costOptimizationTips": ["List 4-5 specific ways to reduce costs without compromising quality"]
  },
  
  "mvpDefinition": {
    "coreFeatures": ["List 5-8 must-have features for MVP"],
    "timeline": "Specific MVP timeline (e.g., '8-10 weeks')",
    "costEstimate": "MVP-specific cost estimate",
    "successMetrics": ["List 4-5 measurable success criteria"]
  },
  
  "riskAssessment": {
    "potentialRisks": [
      {
        "risk": "Specific risk description",
        "impact": "High/Medium/Low",
        "mitigation": "Detailed mitigation strategy"
      }
    ],
    "securityConsiderations": ["List 5-6 specific security measures needed"]
  },
  
  "securityRequirements": {
    "authentication": ["List 3-4 authentication methods/standards"],
    "dataProtection": ["List 4-5 data protection measures"],
    "compliance": ["List relevant compliance requirements"],
    "bestPractices": ["List 4-5 security best practices"]
  },
  
  "competitiveAnalysis": {
    "marketInsights": "Detailed market analysis (2-3 sentences)",
    "differentiationOpportunities": ["List 5-6 specific ways to stand out"],
    "keyFeaturesComparison": "Detailed comparison with market standards"
  },
  
  "scalabilityPlan": {
    "userGrowthStrategy": "Specific strategy for handling user growth",
    "dataGrowthStrategy": "Strategy for managing data growth",
    "performanceTargets": {
      "responseTime": "<200ms for API calls",
      "uptime": "99.9% availability",
      "concurrent_users": "Support 10,000+ concurrent users"
    }
  },
  
  "teamComposition": {
    "immediate": ["Solo developer", "Part-time UI/UX designer"],
    "future": ["List 3-4 future team members needed"],
    "estimatedHours": {
      "development": 400,
      "design": 80,
      "testing": 60,
      "management": 40
    }
  },
  
  "maintenanceStrategy": {
    "updateFrequency": "Bi-weekly releases",
    "monitoringTools": ["List 3-4 specific monitoring tools"],
    "backupStrategy": "Automated daily backups with 30-day retention",
    "supportModel": "Email support with 24-hour response time"
  },
  
  "integrationMap": {
    "required": ["List 3-5 essential integrations"],
    "recommended": ["List 3-5 recommended integrations"],
    "future": ["List 3-5 future integration possibilities"]
  },
  
  "nextSteps": ["List 8-10 specific, actionable next steps in priority order"],
  
  "projectIdeas": {
    "innovativeFeatures": ["List 5-7 creative features that could set this project apart"],
    "userExperienceEnhancements": ["List 4-6 UX improvements for better engagement"],
    "gamificationElements": ["List 3-4 gamification ideas if applicable"],
    "aiIntegrationOpportunities": ["List 3-5 AI/ML features that could add value"]
  },
  
  "marketPositioning": {
    "targetAudience": "Detailed target audience analysis with demographics",
    "uniqueSellingProposition": "Clear USP that differentiates from competitors",
    "marketingChannels": ["List 4-6 recommended marketing channels"],
    "growthStrategy": "Comprehensive growth strategy for first year"
  },
  
  "monetizationStrategy": {
    "revenueModels": ["List 3-4 potential revenue models"],
    "pricingStrategy": "Detailed pricing recommendation with tiers",
    "projectedRevenue": {
      "month3": "$X,XXX - $X,XXX",
      "month6": "$XX,XXX - $XX,XXX",
      "year1": "$XXX,XXX - $XXX,XXX"
    },
    "monetizationTimeline": "When and how to implement monetization"
  },
  
  "userExperienceStrategy": {
    "designPrinciples": ["List 4-5 core UX principles for the project"],
    "userJourney": "Detailed user journey from landing to conversion",
    "accessibilityFeatures": ["List 4-5 accessibility features to implement"],
    "mobileOptimization": "Specific mobile UX considerations"
  },
  
  "performanceOptimization": {
    "frontendOptimizations": ["List 4-5 frontend performance techniques"],
    "backendOptimizations": ["List 4-5 backend optimization strategies"],
    "cachingStrategy": "Detailed caching approach for scalability",
    "cdnRecommendations": "CDN setup and configuration advice"
  },
  
  "analyticsAndMetrics": {
    "kpis": ["List 5-6 key performance indicators to track"],
    "analyticsTools": ["List 3-4 recommended analytics platforms"],
    "reportingDashboard": "Dashboard requirements and metrics visualization",
    "dataInsights": "How to use data for continuous improvement"
  },
  
  "longTermVision": {
    "year1Goals": ["List 4-5 specific year 1 objectives"],
    "year2Expansion": "Vision for year 2 growth and features",
    "exitStrategy": "Potential exit strategies if applicable",
    "scalabilityRoadmap": "Long-term technical scalability plan"
  },
  
  "projectThoughts": {
    "strengths": ["List 4-5 project strengths"],
    "challenges": ["List 3-4 potential challenges"],
    "opportunities": ["List 4-5 market opportunities"],
    "recommendations": "Overall strategic recommendations (2-3 sentences)"
  }
}

IMPORTANT: 
- Fill EVERY field with specific, detailed information
- Avoid generic responses - be specific to this project
- Include technical details that can be immediately acted upon
- Ensure all arrays have multiple items (not just 1-2)
- Provide realistic estimates based on the project scope
- Be creative and innovative in your suggestions
- Consider the solo developer context for all recommendations
- Your response must be valid JSON`;

    // Generate insights with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw Gemini response received");
    
    // Parse the JSON response
    let insights;
    try {
      // Extract JSON from the response (in case it's wrapped in markdown code blocks)
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      insights = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.error("Raw response:", text);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to parse AI response. Please try again."
      );
    }

    // Add metadata
    const insightsWithMetadata = {
      ...insights,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      modelUsed: "gemini-2.0-flash",
      userId: context.auth.uid
    };

    // Log success
    console.log("Project insights generated successfully");

    return {
      status: "success",
      insights: insightsWithMetadata
    };

  } catch (error) {
    console.error("Error generating project insights:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      name: error.name
    });
    
    // Handle specific Gemini API errors
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key not valid")) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "AI service configuration error. Please contact support."
      );
    }
    
    if (error.message?.includes("RATE_LIMIT") || error.message?.includes("quota")) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "AI service is temporarily unavailable due to high demand. Please try again later."
      );
    }
    
    if (error.message?.includes("PERMISSION_DENIED") || error.message?.includes("403")) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "AI service access denied. Please check API key permissions."
      );
    }
    
    // Check for network/CORS issues
    if (error.name === 'NetworkError' || error.message?.includes('Failed to fetch') || error.message?.includes('CORS')) {
      throw new functions.https.HttpsError(
        "unavailable",
        "Cannot connect to AI service. This may be a deployment issue. Please ensure Cloud Functions are deployed."
      );
    }

    // Generic error with more details
    throw new functions.https.HttpsError(
      "internal",
      `Failed to generate project insights: ${error.message || "Unknown error"}`,
      { 
        errorDetails: error.toString(),
        errorMessage: error.message,
        errorCode: error.code,
        errorName: error.name
      }
    );
  }
});
