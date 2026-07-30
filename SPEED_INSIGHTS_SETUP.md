# Vercel Speed Insights Setup

This document describes how Vercel Speed Insights has been integrated into the Resource Discovery Agent project.

## Installation

The `@vercel/speed-insights` package (v1.1.0) has been installed as a project dependency:

```bash
npm install @vercel/speed-insights
```

## Integration Approach

Since this is a **Cloudflare Workers** project (not a traditional framework like Next.js or React), we've used the **vanilla JavaScript/HTML** integration method as specified in the [Vercel Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart).

### Implementation Details

The Speed Insights tracking is integrated directly into the HTML served by the Cloudflare Worker in `src/index.js`:

```html
<!-- Vercel Speed Insights Integration -->
<script>
  window.si = window.si || function () { 
    (window.siq = window.siq || []).push(arguments); 
  };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

This follows the official Vercel documentation for "Vanilla/Other Frameworks" integration.

## How It Works

1. **Script Initialization**: The first script tag initializes the Speed Insights queue (`window.si` and `window.siq`)
2. **Script Loading**: The second script tag loads the Speed Insights tracking script from `/_vercel/speed-insights/script.js`
3. **Vercel Platform**: When deployed on Vercel, the platform automatically serves the Speed Insights script at the `/_vercel/speed-insights/*` routes
4. **Data Collection**: Speed Insights automatically collects Web Vitals metrics (LCP, FID, CLS, FCP, TTFB) from real user visits

## Deployment Requirements

### On Vercel Platform

1. **Deploy to Vercel**: Deploy this Cloudflare Worker code to Vercel using the Vercel CLI or Git integration
2. **Enable Speed Insights**: In your Vercel dashboard, navigate to your project's Speed Insights section and click "Enable"
3. **Routes Configuration**: Vercel automatically handles the `/_vercel/speed-insights/*` routes after enabling Speed Insights

### On Cloudflare Workers

When running on Cloudflare Workers directly (not through Vercel):
- The Speed Insights script tags will be present in the HTML
- The `/_vercel/speed-insights/*` routes return a basic 200 response (see `src/index.js`)
- To get actual Speed Insights data, you would need to deploy to Vercel or proxy the Speed Insights endpoints

## Verification

After deployment on Vercel:

1. Visit your deployed application
2. Open browser DevTools > Network tab
3. Look for requests to `/_vercel/speed-insights/script.js` and `/_vercel/speed-insights/vitals`
4. Check your Vercel dashboard > Speed Insights to see collected metrics

## Files Modified

- `package.json` - Added `@vercel/speed-insights` dependency
- `src/index.js` - Integrated Speed Insights script tags into HTML output
- `wrangler.toml` - Pre-existing Cloudflare Workers configuration (unchanged)

## Performance Impact

The Speed Insights integration:
- Uses a deferred script load to avoid blocking page rendering
- Minimal performance overhead (~1KB gzipped)
- Only sends data after page interaction
- Does not impact Core Web Vitals scores

## Additional Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart)
- [Web Vitals Explanation](https://web.dev/vitals/)
