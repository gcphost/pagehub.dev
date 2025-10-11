import Head from "next/head";
import { useState } from "react";
import schema from "../../selectors-schema.json";

const Selectors = () => {
  const [selectedComponent, setSelectedComponent] = useState("Background");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    definitions: true,
    selectors: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderProperties = (properties: any, prefix = "") => {
    return (
      <div className="space-y-2">
        {Object.entries(properties).map(([key, value]: [string, any]) => {
          // Handle $ref objects
          let displayValue = value;
          if (typeof value === "object" && value !== null) {
            if (value.$ref) {
              // Extract the definition name from the $ref path
              const refName = value.$ref.split("/").pop();
              displayValue = `→ ${refName}`;
            } else {
              displayValue = JSON.stringify(value);
            }
          }

          return (
            <div
              key={key}
              className="flex items-start gap-3 rounded px-3 py-2 hover:bg-background"
            >
              <code className="whitespace-nowrap font-mono text-sm text-blue-600">
                {prefix}
                {key}
              </code>
              <span className="text-sm text-muted-foreground">
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSelector = (name: string, data: any) => {
    const isSelected = selectedComponent === name;

    return (
      <div
        id={`component-${name}`}
        key={name}
        className={`scroll-mt-4 overflow-hidden rounded-lg border transition-all ${
          isSelected ? "border-blue-500 shadow-lg" : "border-border"
        }`}
      >
        <button
          onClick={() => setSelectedComponent(isSelected ? null : name)}
          className={`flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-background ${
            isSelected ? "bg-blue-50" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
            <span className="text-sm italic text-muted-foreground">
              {data.description}
            </span>
          </div>
          <svg
            className={`size-5 transition-transform ${
              isSelected ? "rotate-180" : ""
            }`}
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

        {isSelected && (
          <div className="space-y-6 border-t bg-background px-6 py-4">
            {/* Extends */}
            {data.extends && (
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground">
                  Extends
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.extends.map((ext: string) => (
                    <span
                      key={ext}
                      className="rounded-full bg-primary px-3 py-1 font-mono text-sm text-primary"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specific Props */}
            {data.specificProps && (
              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
                  Specific Properties
                </h4>
                {renderProperties(data.specificProps)}
              </div>
            )}

            {/* Supports */}
            {data.supports && (
              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
                  Supported Props
                </h4>
                <div className="space-y-3">
                  {Object.entries(data.supports).map(
                    ([key, values]: [string, any]) => (
                      <div key={key}>
                        <h5 className="mb-2 text-sm font-medium text-muted-foreground">
                          {key}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(values) ? (
                            values.map((prop: string) => (
                              <code
                                key={prop}
                                className="rounded bg-background px-2 py-1 font-mono text-xs text-foreground"
                              >
                                {prop}
                              </code>
                            ))
                          ) : (
                            <code className="rounded bg-background px-2 py-1 font-mono text-xs text-foreground">
                              {values}
                            </code>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {data.notes && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">{data.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const filteredSelectors = Object.entries(schema.selectors).filter(
    ([name, data]: [string, any]) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const scrollToComponent = (name: string) => {
    setSelectedComponent(name);
    const element = document.getElementById(`component-${name}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Head>
        <title>Selectors Documentation - PageHub</title>
        <meta
          name="description"
          content="Complete reference for all PageHub selector components and their properties"
        />
      </Head>

      <div className="flex h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header - Fixed */}
        <header className="shrink-0 border-b border-border bg-background shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Selectors Documentation
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Complete reference for all PageHub selector components
                </p>
              </div>
              <a
                href="/"
                className="rounded-lg bg-blue-600 px-4 py-2 text-primary-foreground transition-colors hover:bg-blue-700"
              >
                Back to Home
              </a>
            </div>

            {/* Search */}
            <div className="mt-6">
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Sidebar */}
              <aside className="space-y-4 lg:col-span-1">
                <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm lg:sticky lg:top-4">
                  <div className="border-b border-border bg-background px-4 py-3">
                    <h3 className="font-semibold text-foreground">
                      Quick Links
                    </h3>
                  </div>
                  <nav className="max-h-[calc(100vh-16rem)] overflow-y-auto p-2">
                    <div className="space-y-1">
                      {Object.keys(schema.selectors).map((name) => (
                        <button
                          key={name}
                          onClick={() => scrollToComponent(name)}
                          className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                            selectedComponent === name
                              ? "bg-blue-100 font-medium text-blue-700"
                              : "text-foreground hover:bg-background"
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <main className="space-y-8 lg:col-span-3">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">
                      {Object.keys(schema.selectors).length}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Components
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
                    <div className="text-3xl font-bold text-primary">
                      {Object.keys(schema.definitions).length}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Definitions
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
                    <div className="text-3xl font-bold text-secondary-foreground">
                      {schema.version}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Version
                    </div>
                  </div>
                </div>

                {/* Definitions */}
                <section className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                  <button
                    onClick={() => toggleSection("definitions")}
                    className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-background"
                  >
                    <h2 className="text-2xl font-bold text-foreground">
                      Definitions
                    </h2>
                    <svg
                      className={`size-6 transition-transform ${
                        expandedSections.definitions ? "rotate-180" : ""
                      }`}
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

                  {expandedSections.definitions && (
                    <div className="space-y-6 border-t px-6 py-4">
                      {Object.entries(schema.definitions).map(
                        ([name, def]: [string, any]) => (
                          <div
                            key={name}
                            className="border-l-4 border-purple-500 pl-4"
                          >
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                              {name}
                            </h3>
                            <p className="mb-3 text-sm text-muted-foreground">
                              {def.description}
                            </p>
                            {def.properties && renderProperties(def.properties)}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </section>

                {/* Selectors */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Components ({filteredSelectors.length})
                  </h2>
                  <div className="space-y-4">
                    {filteredSelectors.map(([name, data]) =>
                      renderSelector(name, data),
                    )}
                  </div>
                </section>

                {/* Examples */}
                <section className="rounded-lg border border-border bg-background p-6 shadow-sm">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">
                    Usage Examples
                  </h2>
                  <div className="space-y-6">
                    {Object.entries(schema.usage.examples).map(
                      ([name, example]: [string, any]) => (
                        <div key={name}>
                          <h3 className="mb-2 text-lg font-semibold text-foreground">
                            {name}
                          </h3>
                          <p className="mb-3 text-sm text-muted-foreground">
                            {example.description}
                          </p>
                          <pre className="overflow-x-auto rounded-lg bg-foreground p-4 text-background">
                            <code>
                              {JSON.stringify(example.props, null, 2)}
                            </code>
                          </pre>
                        </div>
                      ),
                    )}
                  </div>
                </section>

                {/* Reference */}
                <section className="rounded-lg border border-border bg-background p-6 shadow-sm">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">
                    Reference
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {Object.entries(schema.reference).map(
                      ([key, value]: [string, any]) => (
                        <div key={key}>
                          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground">
                            {key}
                          </h3>
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-2">
                              {value.map((item: string) => (
                                <code
                                  key={item}
                                  className="rounded bg-background px-2 py-1 font-mono text-xs text-foreground"
                                >
                                  {item}
                                </code>
                              ))}
                            </div>
                          ) : typeof value === "object" ? (
                            <div className="space-y-2">
                              {Object.entries(value).map(([k, v]) => (
                                <div key={k} className="text-sm">
                                  <span className="font-medium text-foreground">
                                    {k}:
                                  </span>{" "}
                                  <span className="text-muted-foreground">
                                    {String(v)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {String(value)}
                            </p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </section>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Selectors;
