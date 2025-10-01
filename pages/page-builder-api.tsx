import Head from 'next/head';
import { useState } from 'react';
import {
  FaBolt,
  FaBuilding,
  FaBullseye,
  FaCheck,
  FaCheckCircle,
  FaClipboardList,
  FaExclamationTriangle,
  FaFile,
  FaFileAlt,
  FaInbox,
  FaLightbulb,
  FaLock,
  FaPalette,
  FaPlug,
  FaSave,
  FaStore
} from 'react-icons/fa';
import openApiSpec from '../openapi.json';

const nunitoStyle = `
  * {
    font-family: 'Nunito', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
  }
`;

interface EndpointProps {
  path: string;
  method: string;
  endpoint: any;
}

function EndpointCard({ path, method, endpoint }: EndpointProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const methodColors = {
    get: 'bg-green-100 text-green-800 border-green-300',
    post: 'bg-orange-100 text-orange-800 border-orange-300',
    put: 'bg-blue-100 text-blue-800 border-blue-300',
    delete: 'bg-red-100 text-red-800 border-red-300',
  };

  const methodColor = methodColors[method.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
      >
        <span className={`${methodColor} px-3 py-1 rounded font-semibold text-sm uppercase border`}>
          {method}
        </span>
        <span className="font-mono text-gray-900 flex-1">{path}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{endpoint.summary}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{endpoint.description}</p>
            </div>

            {/* Parameters */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Parameters</h5>
                <div className="space-y-2">
                  {endpoint.parameters.map((param: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-2">
                        <code className="text-sm font-mono text-purple-600">{param.name}</code>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {param.in}
                        </span>
                        {param.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{param.description}</p>
                      {param.schema?.example && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Example: </span>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{param.schema.example}</code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {endpoint.requestBody && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Request Body</h5>
                <p className="text-sm text-gray-600 mb-3">{endpoint.requestBody.description}</p>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 text-gray-300 text-xs font-semibold">
                    JSON
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm">
                    <code className="text-gray-100">
                      {JSON.stringify(
                        endpoint.requestBody.content['application/json'].example,
                        null,
                        2
                      )}
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {/* Responses */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Responses</h5>
              <div className="space-y-3">
                {Object.entries(endpoint.responses).map(([code, response]: [string, any]) => (
                  <div key={code} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                      <span className={`font-semibold ${code.startsWith('2') ? 'text-green-600' : 'text-red-600'}`}>
                        {code}
                      </span>
                      <span className="text-sm text-gray-600">{response.description}</span>
                    </div>
                    {response.content?.['application/json']?.example && (
                      <div className="bg-gray-900">
                        <pre className="p-4 overflow-x-auto text-sm">
                          <code className="text-gray-100">
                            {JSON.stringify(response.content['application/json'].example, null, 2)}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiDocs() {
  const paths = openApiSpec.paths;

  return (
    <>
      <Head>
        <title>PageHub - Add Page Building to Your Product</title>
        <meta name="description" content="Seamlessly embed a powerful page builder into your SaaS. Your users create pages, you control the data. Perfect for CMSs, platforms, and white-label solutions." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: nunitoStyle }} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-white py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center">

              <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
                Add Page Building to<br />Your Product
              </h1>
              <p className="text-2xl mb-8 opacity-95 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
                Seamlessly add page building to your product. Your users create pages, you control the data.
                Perfect for <u>SaaS apps</u>, <u>CMSs</u>, and <u>platforms</u> that need white-label page creation.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a href="#quick-start" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Get Started →
                </a>
                <a href="#api-reference" className="bg-white/10 backdrop-blur border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all">
                  View API Docs
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why PageHub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stop building page editors from scratch. Integrate PageHub in hours, not months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-4xl mb-4"><FaPalette className="text-purple-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Brand, Your Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete white-label solution. Custom domains, your branding, your database.
                PageHub is invisible to your users - it&apos;s just your product.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-4xl mb-4"><FaPlug className="text-blue-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Simple Webhooks</h3>
              <p className="text-gray-600 leading-relaxed">
                Four webhooks, total control. Load pages, save pages, generate static sites.
                All the power, none of the complexity.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-4xl mb-4"><FaBolt className="text-yellow-500" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Powerful & Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Modern drag-and-drop editor built on React. Mobile responsive, fast page loads,
                and clean code output. Ship features in hours, not months.
              </p>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Dedicated Infrastructure</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every customer gets their own isolated infrastructure. No shared resources, no noisy neighbors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <FaBolt className="text-2xl text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Dedicated CDN</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Your own CDN endpoint for serving static sites. Isolated delivery network with your custom domain.
                      Fast, reliable, and completely separate from other customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <FaStore className="text-2xl text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Dedicated Hosting</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Your pages live on dedicated infrastructure. Optional: use our hosting or keep it all internal.
                      Either way, your resources are yours alone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 rounded-lg p-3">
                    <FaLock className="text-2xl text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Isolated Data Storage</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Your page data is stored separately from everyone else. Complete data isolation with dedicated database instances.
                      Your data never touches another customer&apos;s.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <FaPalette className="text-2xl text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Full White-Label</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Keep everything behind your brand. We can run completely internal to your brand.
                      Your users never see PageHub - just your product.
                    </p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white border-y border-gray-200 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built For Integration</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Companies use PageHub to add page building capabilities to their platforms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2"><FaBuilding className="text-purple-600" /> SaaS Platforms</h3>
                <p className="text-gray-700 mb-4">
                  Let your customers build landing pages, marketing sites, or customer portals without leaving your platform.
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Example:</strong> A CRM adds custom landing pages for each client
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2"><FaFileAlt className="text-blue-600" /> Content Management</h3>
                <p className="text-gray-700 mb-4">
                  Add visual page building to your CMS. Writers create content, designers build layouts, all in one place.
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Example:</strong> A headless CMS adds drag-and-drop page creation
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2"><FaStore className="text-green-600" /> Multi-Tenant Platforms</h3>
                <p className="text-gray-700 mb-4">
                  Each tenant gets their own page builder. Separate data, shared infrastructure. Perfect for marketplace builders.
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Example:</strong> An e-commerce platform where each store builds custom pages
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2"><FaBullseye className="text-orange-600" /> White-Label Solutions</h3>
                <p className="text-gray-700 mb-4">
                  Resell page building under your brand. Your logo, your pricing, your customers. We&apos;re just the engine.
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Example:</strong> An agency offers website building to 100+ clients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div id="quick-start" className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Started in Minutes</h2>
            <p className="text-xl text-gray-600">
              Four webhooks. That&apos;s it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-3xl mb-3"><FaInbox className="text-purple-600" /></div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">onLoad</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Return page data when users open the editor
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-3xl mb-3"><FaSave className="text-purple-600" /></div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">onSave</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receive and store page data when users hit save
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-3xl mb-3"><FaFile className="text-purple-600" /></div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">fetchPage</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Provide page content for static site generation
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-3xl mb-3"><FaClipboardList className="text-purple-600" /></div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">fetchPageList</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Return list of pages to compile into static sites
              </p>
            </div>
          </div>


        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to integrate?</h2>
            <p className="text-xl mb-8 opacity-95">
              Join companies building the next generation of page creation tools
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="#api-reference" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                Read the API Docs
              </a>
              <a href="mailto:hello@pagehub.dev" className="bg-white/10 backdrop-blur border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all">
                Contact Sales
              </a>
            </div>
          </div>
        </div>

        {/* API Reference Divider */}
        <div id="api-reference" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">API Reference</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete technical documentation for implementing PageHub webhooks
            </p>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="bg-white border-y border-gray-200 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3"><FaLock className="text-green-600" /> Authentication & Security</h2>

            <div className="bg-gray-50 rounded-xl p-8 space-y-8">
              <div className="pb-6 border-b border-gray-200">
                <p className="text-gray-600 leading-relaxed">
                  PageHub automatically forwards authentication headers from the original user request to your webhook endpoints.
                  This allows you to verify requests and ensure they come from authenticated users.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How Authentication Works</h3>
                <p className="text-gray-600 mb-4">
                  When a user opens the page editor, PageHub calls your <code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-purple-600 font-mono">onLoad</code> webhook
                  and automatically forwards their authentication headers. This lets you verify the user and return their page data.
                </p>
                <p className="text-gray-600 mb-4 font-semibold">Headers forwarded to your onLoad endpoint:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-purple-600 font-mono">authorization</code> - Bearer tokens, Basic auth, etc.</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-purple-600 font-mono">x-api-key</code> - Custom API key header</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-purple-600 font-mono">x-auth-token</code> - Custom auth token header</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-purple-600 font-mono">x-access-token</code> - Custom access token header</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-purple-600 font-mono">cookie</code> - Session cookies and auth cookies</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaBullseye className="text-indigo-600" /> Token Flow: onLoad → onSave</h3>
                <p className="text-gray-600 mb-4">
                  PageHub supports a secure token flow where you can return a token from <code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-purple-600 font-mono">onLoad</code>
                  and it will automatically be sent in the <code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-purple-600 font-mono">authorization</code> header when <code className="bg-gray-100 px-2 py-0.5 rounded text-sm text-purple-600 font-mono">onSave</code> is called.
                </p>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <FaLightbulb className="text-2xl text-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">How It Works</h4>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                          <li>User loads a page → <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">onLoad</code> webhook is called</li>
                          <li>Your <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">onLoad</code> response includes a <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">token</code> field</li>
                          <li>PageHub stores the token and includes it in the <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">authorization</code> header</li>
                          <li>When user saves → <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">onSave</code> receives the token automatically</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm font-semibold border-b border-gray-700">
                      Step 1: Return a token from onLoad
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="text-gray-100">{`// Your onLoad webhook endpoint
export default async function handler(req, res) {
  const { pageId } = req.params;
  
  // Validate the user using forwarded auth headers
  const user = await validateUser(req.headers.authorization);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Load the page document for this user
  const pageDocument = await loadPageForUser(pageId, user.id);
  
  // Generate a short-lived token for this editing session
  const sessionToken = generateToken({
    userId: user.id,
    pageId: pageId,
    expiresIn: '30m' // 30 minutes
  });
  
  return res.status(200).json({
    document: pageDocument, // Compressed page data
    token: sessionToken,    // ← This token will be sent to onSave!
    message: 'Page loaded successfully',
    timestamp: new Date().toISOString()
  });
}`}</code>
                    </pre>
                  </div>

                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm font-semibold border-b border-gray-700">
                      Step 2: Receive and validate the token in onSave
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="text-gray-100">{`// Your onSave webhook endpoint
export default async function handler(req, res) {
  // Extract the token from the forwarded auth header
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  
  try {
    // Verify the token that was returned from onLoad
    const decoded = verifyToken(token);
    
    // Validate the token hasn't expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    // Verify the user has access to save this page
    const { tenantId, pageId, document } = req.body;
    
    if (decoded.pageId !== pageId) {
      return res.status(403).json({ error: 'Token not valid for this page' });
    }
    
    // Save the page
    await savePage({
      userId: decoded.userId,
      pageId: pageId,
      document: document
    });
    
    return res.status(200).json({
      _id: pageId,
      draftId: pageId,
      saved: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaLightbulb className="text-yellow-500" /> Security Best Practices</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-start text-sm">
                    <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Use HTTPS for all webhook endpoints</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Implement rate limiting on your webhook endpoints</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Validate the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-red-600">tenantId</code> matches the authenticated user</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Use short-lived tokens (15-60 minutes) to minimize risk</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Log all webhook calls for audit trails</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Implement IP allowlisting if your infrastructure supports it</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <FaExclamationTriangle className="text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Never expose webhook URLs publicly without authentication</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <FaExclamationTriangle className="text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Don&apos;t rely solely on obscure URLs for security</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">API Endpoints</h2>
          <div className="space-y-4">
            {Object.entries(paths).map(([path, methods]: [string, any]) =>
              Object.entries(methods).map(([method, endpoint]: [string, any]) => (
                <EndpointCard
                  key={`${method}-${path}`}
                  path={path}
                  method={method}
                  endpoint={endpoint}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

