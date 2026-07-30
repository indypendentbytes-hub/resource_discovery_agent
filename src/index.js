/**
 * Resource Discovery Agent - Cloudflare Worker
 * A guided decision-support system for business ownership programs
 */

export default {
  async fetch(request, env, ctx) {
    // Parse the URL to handle different routes
    const url = new URL(request.url);
    
    // Handle Speed Insights routes
    if (url.pathname.startsWith('/_vercel/speed-insights/')) {
      // These routes are handled by Vercel when deployed on Vercel platform
      // For local development, return a simple 200 response
      return new Response('Speed Insights endpoint', { status: 200 });
    }
    
    // Serve the main application HTML
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(getHTML(), {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
      });
    }
    
    // Handle API routes (to be implemented)
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, url);
    }
    
    // 404 for other routes
    return new Response('Not Found', { status: 404 });
  },
};

/**
 * Handle API requests
 */
function handleAPI(request, url) {
  return new Response(
    JSON.stringify({ 
      message: 'API endpoint - to be implemented',
      path: url.pathname 
    }),
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }
  );
}

/**
 * Generate the main HTML page with Vercel Speed Insights integration
 */
function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resource Discovery Agent</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
      max-width: 800px;
      width: 100%;
    }
    
    h1 {
      color: #667eea;
      margin-bottom: 20px;
      font-size: 2.5rem;
    }
    
    h2 {
      color: #764ba2;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }
    
    p {
      margin-bottom: 15px;
      color: #555;
    }
    
    .cta-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
    
    .features {
      margin-top: 30px;
    }
    
    .feature {
      background: #f7f7f7;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      border-left: 4px solid #667eea;
    }
    
    .feature h3 {
      color: #667eea;
      margin-bottom: 8px;
    }
    
    .status {
      display: inline-block;
      background: #4caf50;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Resource Discovery Agent <span class="status">✓ Speed Insights Active</span></h1>
    
    <p>
      Welcome to the Resource Discovery Agent - a guided decision-support system that helps 
      people identify, compare, prepare for, and successfully engage with programs and 
      organizations that can support business ownership.
    </p>
    
    <h2>What Makes This Different</h2>
    <p>
      This is not a link directory. It's an intelligent system that turns your goals, 
      circumstances, location, readiness, and constraints into a personalized resource pathway.
    </p>
    
    <div class="features">
      <div class="feature">
        <h3>🎯 Personalized Recommendations</h3>
        <p>Get resources that match your specific needs, stage, and location.</p>
      </div>
      
      <div class="feature">
        <h3>📊 Detailed Comparisons</h3>
        <p>Understand why one program fits better than another with clear explanations.</p>
      </div>
      
      <div class="feature">
        <h3>📝 Preparation Support</h3>
        <p>Know exactly what to prepare before engaging with any resource.</p>
      </div>
      
      <div class="feature">
        <h3>📈 Progress Tracking</h3>
        <p>Track your journey and get recommendations for the next logical step.</p>
      </div>
    </div>
    
    <button class="cta-button" onclick="alert('Agent interface coming soon!')">
      Start Your Discovery Journey
    </button>
  </div>
  
  <!-- Vercel Speed Insights Integration -->
  <script>
    window.si = window.si || function () { 
      (window.siq = window.siq || []).push(arguments); 
    };
  </script>
  <script defer src="/_vercel/speed-insights/script.js"></script>
</body>
</html>`;
}
