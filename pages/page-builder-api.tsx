import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  FaBolt,
  FaBuilding,
  FaBullseye,
  FaCheck,
  FaClipboardList,
  FaCode,
  FaFile,
  FaFileAlt,
  FaInbox,
  FaLightbulb,
  FaLock,
  FaPalette,
  FaPlug,
  FaSave,
  FaStore,
} from "react-icons/fa";
import openApiSpec from "../openapi.json";

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
    get: "bg-secondary text-green-800 border-green-300",
    post: "bg-orange-100 text-orange-800 border-orange-300",
    put: "bg-blue-100 text-blue-800 border-blue-300",
    delete: "bg-destructive text-red-800 border-destructive",
  };

  const methodColor =
    methodColors[method.toLowerCase()] || "bg-background text-foreground";

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-background"
      >
        <span
          className={`${methodColor} rounded border px-3 py-1 text-sm font-semibold uppercase`}
        >
          {method}
        </span>
        <span className="flex-1 font-mono text-foreground">{path}</span>
        <svg
          className={`size-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-border bg-background p-6">
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h4 className="mb-2 font-semibold text-foreground">
                {endpoint.summary}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {endpoint.description}
              </p>
            </div>

            {/* Parameters */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div>
                <h5 className="mb-3 font-semibold text-foreground">
                  Parameters
                </h5>
                <div className="space-y-2">
                  {endpoint.parameters.map((param: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      <div className="flex items-start gap-2">
                        <code className="font-mono text-sm text-primary">
                          {param.name}
                        </code>
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                          {param.in}
                        </span>
                        {param.required && (
                          <span className="text-red-800 rounded bg-destructive px-2 py-0.5 text-xs">
                            required
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {param.description}
                      </p>
                      {param.schema?.example && (
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">
                            Example:{" "}
                          </span>
                          <code className="rounded bg-background px-2 py-1 text-xs">
                            {param.schema.example}
                          </code>
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
                <h5 className="mb-3 font-semibold text-foreground">
                  Request Body
                </h5>
                <p className="mb-3 text-sm text-muted-foreground">
                  {endpoint.requestBody.description}
                </p>
                <div className="overflow-hidden rounded-lg bg-foreground">
                  <div className="bg-muted-foreground px-4 py-2 text-xs font-semibold text-muted-foreground">
                    JSON
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm">
                    <code className="text-background">
                      {JSON.stringify(
                        endpoint.requestBody.content["application/json"]
                          .example,
                        null,
                        2,
                      )}
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {/* Responses */}
            <div>
              <h5 className="mb-3 font-semibold text-foreground">Responses</h5>
              <div className="space-y-3">
                {Object.entries(endpoint.responses).map(
                  ([code, response]: [string, any]) => (
                    <div
                      key={code}
                      className="overflow-hidden rounded-lg border border-border bg-background"
                    >
                      <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-2">
                        <span
                          className={`font-semibold ${code.startsWith("2") ? "text-secondary-foreground" : "text-destructive"}`}
                        >
                          {code}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {response.description}
                        </span>
                      </div>
                      {response.content?.["application/json"]?.example && (
                        <div className="bg-foreground">
                          <pre className="overflow-x-auto p-4 text-sm">
                            <code className="text-background">
                              {JSON.stringify(
                                response.content["application/json"].example,
                                null,
                                2,
                              )}
                            </code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ),
                )}
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
        <meta
          name="description"
          content="Seamlessly embed a powerful page builder into your SaaS. Your users create pages, you control the data. Perfect for CMSs, platforms, and white-label solutions."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: nunitoStyle }} />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 px-4 py-32 text-primary-foreground md:py-40">
          <div className="bg-grid-white/[0.05] absolute inset-0 bg-[size:30px_30px]"></div>
          <div className="relative mx-auto max-w-6xl">
            <div className="text-center">
              <h1 className="mb-8 text-6xl font-bold drop-shadow-2xl md:text-7xl">
                Add Page Building to
                <br />
                Your Product
              </h1>
              <p className="mx-auto mb-12 max-w-3xl text-2xl leading-relaxed opacity-95 drop-shadow-lg">
                Seamlessly add a page builder to your product. Your users create
                pages, you control the data. Perfect for <u>SaaS apps</u>,{" "}
                <u>CMSs</u>, and <u>platforms</u> that need white-label page
                creation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#quick-start"
                  className="rounded-lg bg-background px-8 py-4 text-lg font-semibold text-foreground shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                >
                  Get Started →
                </a>
                <a
                  href="#api-reference"
                  className="bg-background/10 hover:bg-background/20 rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-semibold text-primary-foreground backdrop-blur transition-all"
                >
                  View API Docs
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Why PageHub?
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Building your own page editor from scratch is hard. Integrate
              PageHub in hours, not months.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-10 shadow-lg">
              <div className="mb-6 text-4xl">
                <FaPalette className="text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Your Brand, Your Data
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Complete white-label solution. Custom domains, your branding,
                your database. PageHub is invisible to your users - it&apos;s
                just your product.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-10 shadow-lg">
              <div className="mb-6 text-4xl">
                <FaPlug className="text-blue-600" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Simple Webhooks
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Four webhooks, total control. Load pages, save pages, generate
                static sites. All the power, none of the complexity.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-10 shadow-lg">
              <div className="mb-6 text-4xl">
                <FaBolt className="text-accent-foreground" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Powerful & Fast
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Modern drag-and-drop editor built on React. Mobile responsive,
                fast page loads, and clean code output. Ship features in hours,
                not months.
              </p>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-20 text-center">
              <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
                Dedicated Infrastructure Available
              </h2>
              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
                You can get your own isolated infrastructure.
                <br />
                No shared resources, no noisy neighbors.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-primary bg-background p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary p-3">
                    <FaBolt className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-xl font-bold text-foreground">
                      Dedicated CDN
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      Your own CDN endpoint for serving static sites. Isolated
                      delivery network with your custom domain. Fast, reliable,
                      and completely separate from other customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary bg-background p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary p-3">
                    <FaStore className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-xl font-bold text-foreground">
                      Dedicated Hosting
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      Your pages live on dedicated infrastructure. Your
                      resources are yours alone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary bg-background p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary p-3">
                    <FaLock className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-xl font-bold text-foreground">
                      Your Data, Your Storage
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      Store page data wherever you want via webhooks. Use your
                      own database, your own infrastructure. Or let us handle it
                      with dedicated, isolated storage. You choose.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary bg-background p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary p-3">
                    <FaPalette className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-xl font-bold text-foreground">
                      Full White-Label
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      Keep everything behind your brand. Your users never see
                      PageHub - just your product.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="border-y border-border bg-background py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-20 text-center">
              <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
                Built For Integration
              </h2>
              <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
                Software companies, SaaS platforms, and digital agencies use
                PageHub to embed visual page building capabilities directly into
                their products. From content management systems to marketing
                platforms, PageHub powers drag-and-drop page creation for
                applications that need white-label website building without the
                engineering overhead of building an editor from scratch.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="rounded-2xl border border-primary bg-gradient-to-br from-purple-50 to-pink-50 p-10">
                <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <FaBuilding className="text-primary" /> SaaS Platforms
                </h3>
                <p className="mb-4 text-foreground">
                  Let your customers build landing pages, marketing sites, or
                  customer portals without leaving your platform.
                </p>
                <div className="text-sm text-muted-foreground">
                  <strong>Example:</strong> A CRM adds custom landing pages for
                  each client
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-10">
                <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <FaFileAlt className="text-blue-600" /> Content Management
                </h3>
                <p className="mb-4 text-foreground">
                  Add visual page building to your CMS. Writers create content,
                  designers build layouts, all in one place.
                </p>
                <div className="text-sm text-muted-foreground">
                  <strong>Example:</strong> A headless CMS adds drag-and-drop
                  page creation
                </div>
              </div>

              <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-10">
                <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <FaStore className="text-secondary-foreground" /> Multi-Tenant
                  Platforms
                </h3>
                <p className="mb-4 text-foreground">
                  Each tenant gets their own page builder. Separate data, shared
                  infrastructure. Perfect for marketplace builders.
                </p>
                <div className="text-sm text-muted-foreground">
                  <strong>Example:</strong> An e-commerce platform where each
                  store builds custom pages
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-yellow-50 p-10">
                <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <FaBullseye className="text-orange-600" /> White-Label
                  Solutions
                </h3>
                <p className="mb-4 text-foreground">
                  Resell page building under your brand. Your logo, your
                  pricing, your customers. We&apos;re just the engine.
                </p>
                <div className="text-sm text-muted-foreground">
                  <strong>Example:</strong> An agency offers website building to
                  100+ clients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div id="quick-start" className="mx-auto max-w-5xl px-4 py-24 md:py-32">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-muted-foreground">
              Four webhooks. That&apos;s it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-background p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 text-3xl">
                <FaInbox className="text-primary" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-primary">
                onLoad
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Return page data when users open the editor
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 text-3xl">
                <FaSave className="text-primary" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-primary">
                onSave
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Receive and store page data when users hit save
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 text-3xl">
                <FaFile className="text-primary" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-primary">
                fetchPage
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Provide page content for static site generation
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 text-3xl">
                <FaClipboardList className="text-primary" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-primary">
                fetchPageList
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Return list of pages to compile into static sites
              </p>
            </div>
          </div>
        </div>

        {/* Static Site Generation Flow */}
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-20 text-center">
              <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
                Static Site Generation
              </h2>
              <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
                PageHub can automatically generate static sites from your pages.
                The{" "}
                <code className="rounded bg-secondary px-2 py-1 font-mono text-sm">
                  fetchPage
                </code>{" "}
                and{" "}
                <code className="rounded bg-secondary px-2 py-1 font-mono text-sm">
                  fetchPageList
                </code>{" "}
                webhooks power this process.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* fetchPageList Flow */}
              <div className="rounded-2xl border border-green-100 bg-background p-10 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-secondary p-3">
                    <FaClipboardList className="text-2xl text-secondary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    fetchPageList Webhook
                  </h3>
                </div>

                <p className="mb-6 leading-relaxed text-foreground">
                  Called first during static site generation to get a list of
                  all pages that should be compiled.
                </p>

                <div className="mb-6 overflow-hidden rounded-lg bg-foreground">
                  <div className="bg-muted-foreground px-4 py-2 text-sm font-semibold text-muted-foreground">
                    GET /webhook/fetchPageList
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm">
                    <code className="text-background">{`{
  "pages": [
    "homepage",
    "about-us", 
    "contact",
    "products",
    "blog-post-1"
  ],
  "message": "List of pages to compile",
  "timestamp": "2025-10-01T12:00:00.000Z"
}`}</code>
                  </pre>
                </div>

                <div className="rounded-lg border border-green-200 bg-secondary p-4">
                  <div className="flex items-start gap-2">
                    <FaLightbulb className="mt-1 shrink-0 text-accent-foreground" />
                    <div>
                      <h4 className="mb-1 font-semibold text-green-900">
                        Use Case
                      </h4>
                      <p className="text-sm text-green-800">
                        Tells PageHub which pages exist and should be compiled.
                        Each page identifier in the array will trigger a{" "}
                        <code className="rounded bg-secondary px-1 py-0.5 text-xs">
                          fetchPage
                        </code>{" "}
                        call.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* fetchPage Flow */}
              <div className="rounded-2xl border border-blue-100 bg-background p-10 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <FaFile className="text-2xl text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    fetchPage Webhook
                  </h3>
                </div>

                <p className="mb-6 leading-relaxed text-foreground">
                  Called to fetch individual page data for both static site
                  generation and dynamic page serving. Returns the complete page
                  content and metadata.
                </p>

                <div className="mb-6 overflow-hidden rounded-lg bg-foreground">
                  <div className="bg-muted-foreground px-4 py-2 text-sm font-semibold text-muted-foreground">
                    GET /webhook/fetchPage/{`{domain}`}
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm">
                    <code className="text-background">{`{
  "title": "About Us",
  "description": "Learn more about our company",
  "content": "TlpoOTFBWSZTWYbGZ...",
  "draft": "TlpoOTFBWSZTWYbGZ...",
  "name": "about-us",
  "draftId": "draft-about-us"
}`}</code>
                  </pre>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-2">
                    <FaLightbulb className="mt-1 shrink-0 text-accent-foreground" />
                    <div>
                      <h4 className="mb-1 font-semibold text-blue-900">
                        Use Cases
                      </h4>
                      <p className="text-sm text-blue-800">
                        <strong>Static Generation:</strong> Provides page
                        content for compilation during build time.
                        <br />
                        <strong>Dynamic Serving:</strong> Serves page content
                        on-demand for live websites.
                        <br />
                        Returns both published content and draft content,
                        allowing you to choose which version to deploy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Flow Diagram */}
            <div className="mt-16 rounded-2xl border border-border bg-background p-10 shadow-lg">
              <h3 className="mb-8 text-center text-2xl font-bold text-foreground">
                Complete Generation Flow
              </h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary-foreground">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      PageHub calls fetchPageList
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Gets list of all pages to compile
                    </p>
                  </div>
                  <div className="text-right">
                    <code className="rounded bg-background px-2 py-1 text-xs">
                      GET /webhook/fetchPageList
                    </code>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-primary-foreground">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      PageHub calls fetchPage for each page
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Gets individual page content and metadata (for static
                      generation or dynamic serving)
                    </p>
                  </div>
                  <div className="text-right">
                    <code className="rounded bg-background px-2 py-1 text-xs">
                      GET /webhook/fetchPage/homepage
                    </code>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      PageHub compiles static site
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Generates HTML, CSS, and assets for each page
                    </p>
                  </div>
                  <div className="text-right">
                    <code className="rounded bg-background px-2 py-1 text-xs">
                      Static Site Generated
                    </code>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-background p-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-primary-foreground">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      Pages deployed to CDN
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Static files served from your custom domain
                    </p>
                  </div>
                  <div className="text-right">
                    <code className="rounded bg-background px-2 py-1 text-xs">
                      https://yourdomain.com
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Note */}
            <div className="mt-12 rounded-xl border border-yellow-200 bg-yellow-50 p-8">
              <div className="flex items-start gap-3">
                <FaLock className="mt-1 shrink-0 text-2xl text-accent-foreground" />
                <div>
                  <h4 className="mb-2 font-semibold text-yellow-900">
                    Authentication
                  </h4>
                  <p className="leading-relaxed text-yellow-800">
                    Both{" "}
                    <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs">
                      fetchPage
                    </code>{" "}
                    and{" "}
                    <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs">
                      fetchPageList
                    </code>{" "}
                    use server-to-server authentication with your tenant API
                    key. PageHub sends the{" "}
                    <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs">
                      x-pagehub-auth
                    </code>{" "}
                    header with every request to verify the call came from
                    PageHub.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Page Generation CTA */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <FaCode className="text-2xl" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Want to Generate Your Own Pages?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Create custom page components using our JSON schema. Define your
                own selectors, properties, and UI controls to build exactly what
                you need.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/docs/selectors"
                  className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-purple-700"
                >
                  View Selector Docs
                </Link>
                <Link
                  href="/docs"
                  className="rounded-lg border border-purple-200 bg-background px-8 py-3 font-semibold text-primary transition-colors hover:bg-background"
                >
                  Browse All Docs
                </Link>
              </div>
              <div className="bg-background/50 mx-auto mt-8 max-w-md rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Pro Tip:</strong> Check out our{" "}
                  <code className="rounded bg-background px-1 py-0.5 text-xs">
                    selectors-schema.json
                  </code>{" "}
                  to understand the component structure and create your own
                  custom selectors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-20 md:py-24">
          <div className="mx-auto max-w-4xl text-center text-primary-foreground">
            <h2 className="mb-4 text-4xl font-bold">Ready to integrate?</h2>
            <p className="mb-8 text-xl opacity-95">
              Join companies building the next generation of page creation tools
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#api-reference"
                className="rounded-lg bg-background px-8 py-4 text-lg font-semibold text-primary shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                Read the API Docs
              </a>
              <a
                href="mailto:gcphost@gmail.com"
                className="bg-background/10 hover:bg-background/20 rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-semibold text-primary-foreground backdrop-blur transition-all"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>

        {/* API Reference Divider */}
        <div
          id="api-reference"
          className="mx-auto max-w-6xl px-4 py-24 md:py-32"
        >
          <div className="text-center">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              API Reference
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Complete technical documentation for implementing PageHub webhooks
            </p>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="border-y border-border bg-background px-4 py-24 md:py-32">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 flex items-center justify-center gap-3 text-center text-3xl font-bold text-foreground md:text-4xl">
              <FaLock className="text-secondary-foreground" /> Authentication &
              Security
            </h2>

            <div className="space-y-12 rounded-xl bg-background p-10">
              <div className="border-b border-border pb-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  PageHub uses a token-based authentication system designed for
                  seamless cross-domain integration. Your application passes a
                  token when redirecting users to the editor, and PageHub
                  handles the rest.
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  How Authentication Works
                </h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Since your application and PageHub run on different domains,
                  traditional cookies and auth headers won&apos;t work. Instead,
                  you pass a token in the URL when redirecting users to the
                  editor:
                </p>

                <div className="mb-6 overflow-hidden rounded-lg bg-foreground">
                  <div className="bg-muted-foreground px-4 py-2 text-sm font-semibold text-muted-foreground">
                    Redirect from your application
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm">
                    <code className="text-background">{`// In your .NET/PHP/Node.js app
var token = GenerateToken(userId, pageId, expiresIn: 30min);
Response.Redirect($"https://tenant.pagehub.dev/build/page-123?token={token}");`}</code>
                  </pre>
                </div>

                <p className="mb-4 leading-relaxed text-muted-foreground">
                  PageHub automatically forwards this token to your webhooks in
                  two ways:
                </p>

                <ul className="mb-6 space-y-2">
                  <li className="flex items-start">
                    <FaCheck className="mr-2 mt-1 shrink-0 text-secondary-foreground" />
                    <span className="text-foreground">
                      As a query parameter:{" "}
                      <code className="rounded bg-background px-2 py-0.5 font-mono text-sm text-primary">
                        ?token=YOUR_TOKEN
                      </code>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="mr-2 mt-1 shrink-0 text-secondary-foreground" />
                    <span className="text-foreground">
                      As a header:{" "}
                      <code className="rounded bg-background px-2 py-0.5 font-mono text-sm text-primary">
                        x-pagehub-token: YOUR_TOKEN
                      </code>
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                  <FaLock className="text-secondary-foreground" />{" "}
                  Server-to-Server Authentication
                </h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  In addition to user tokens, PageHub sends a unique tenant auth
                  token with every webhook call to prove the request came from
                  us:
                </p>

                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-6">
                  <div className="flex items-start gap-3">
                    <FaLock className="mt-1 shrink-0 text-2xl text-blue-600" />
                    <div>
                      <h4 className="mb-2 font-semibold text-blue-900">
                        x-pagehub-auth Header
                      </h4>
                      <p className="mb-3 text-sm text-blue-800">
                        Every webhook request includes your tenant&apos;s unique
                        auth token in the{" "}
                        <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                          x-pagehub-auth
                        </code>{" "}
                        header.
                      </p>
                      <div className="mb-2 rounded bg-blue-100 p-3">
                        <code className="break-all text-xs text-blue-900">
                          x-pagehub-auth: ph_1234567890abcdef1234567890abcdef...
                        </code>
                      </div>
                      <p className="text-sm text-blue-800">
                        <strong>Always validate this token</strong> in your
                        webhook endpoints to ensure requests actually came from
                        PageHub and not from an attacker.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                  <FaBullseye className="text-primary" /> Token Flow: onLoad →
                  onSave
                </h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  The authentication flow ensures secure access throughout the
                  editing session:
                </p>

                <div className="space-y-4">
                  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-start gap-2">
                      <FaLightbulb className="mt-1 shrink-0 text-2xl text-accent-foreground" />
                      <div>
                        <h4 className="mb-1 font-semibold text-blue-900">
                          Complete Flow
                        </h4>
                        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-800">
                          <li>
                            Your app redirects:{" "}
                            <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                              https://tenant.pagehub.dev/build/page-123?token=abc123
                            </code>
                          </li>
                          <li>
                            PageHub calls{" "}
                            <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                              onLoad
                            </code>{" "}
                            with the token in query param and header
                          </li>
                          <li>
                            Your{" "}
                            <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                              onLoad
                            </code>{" "}
                            validates the token and returns{" "}
                            <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                              {"{ document, token }"}
                            </code>
                          </li>
                          <li>
                            PageHub stores the new session token from your
                            response
                          </li>
                          <li>
                            When user saves →{" "}
                            <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                              onSave
                            </code>{" "}
                            receives the session token in{" "}
                            <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                              x-pagehub-token
                            </code>{" "}
                            header
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <h2 className="mb-12 text-3xl font-bold text-foreground md:text-4xl">
            API Endpoints
          </h2>
          <div className="space-y-4">
            {Object.entries(paths).map(([path, methods]: [string, any]) =>
              Object.entries(methods).map(
                ([method, endpoint]: [string, any]) => (
                  <EndpointCard
                    key={`${method}-${path}`}
                    path={path}
                    method={method}
                    endpoint={endpoint}
                  />
                ),
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}
