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
              className="flex items-start gap-3 py-2 px-3 hover:bg-gray-50 rounded"
            >
              <code className="text-sm font-mono text-blue-600 whitespace-nowrap">
                {prefix}
                {key}
              </code>
              <span className="text-sm text-gray-600">{displayValue}</span>
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
        className={`border rounded-lg overflow-hidden transition-all scroll-mt-4 ${isSelected ? "border-blue-500 shadow-lg" : "border-gray-200"
          }`}
      >
        <button
          onClick={() =>
            setSelectedComponent(isSelected ? null : name)
          }
          className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50" : ""
            }`}
        >
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <span className="text-sm text-gray-500 italic">
              {data.description}
            </span>
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${isSelected ? "transform rotate-180" : ""
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
          <div className="px-6 py-4 bg-white border-t space-y-6">
            {/* Extends */}
            {data.extends && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Extends
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.extends.map((ext: string) => (
                    <span
                      key={ext}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-mono"
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
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Specific Properties
                </h4>
                {renderProperties(data.specificProps)}
              </div>
            )}

            {/* Supports */}
            {data.supports && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Supported Props
                </h4>
                <div className="space-y-3">
                  {Object.entries(data.supports).map(([key, values]: [string, any]) => (
                    <div key={key}>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">
                        {key}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(values) ? (
                          values.map((prop: string) => (
                            <code
                              key={prop}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono"
                            >
                              {prop}
                            </code>
                          ))
                        ) : (
                          <code className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                            {values}
                          </code>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {data.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
      data.description.toLowerCase().includes(searchQuery.toLowerCase())
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

      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header - Fixed */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Selectors Documentation
                </h1>
                <p className="mt-2 text-gray-600">
                  Complete reference for all PageHub selector components
                </p>
              </div>
              <a
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-4">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Quick Links</h3>
                  </div>
                  <nav className="p-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
                    <div className="space-y-1">
                      {Object.keys(schema.selectors).map((name) => (
                        <button
                          key={name}
                          onClick={() => scrollToComponent(name)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedComponent === name
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
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
              <main className="lg:col-span-3 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-3xl font-bold text-blue-600">
                      {Object.keys(schema.selectors).length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Components</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-3xl font-bold text-purple-600">
                      {Object.keys(schema.definitions).length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Definitions</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="text-3xl font-bold text-green-600">
                      {schema.version}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Version</div>
                  </div>
                </div>

                {/* Definitions */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection("definitions")}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-2xl font-bold text-gray-900">
                      Definitions
                    </h2>
                    <svg
                      className={`w-6 h-6 transition-transform ${expandedSections.definitions ? "transform rotate-180" : ""
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
                    <div className="px-6 py-4 border-t space-y-6">
                      {Object.entries(schema.definitions).map(
                        ([name, def]: [string, any]) => (
                          <div key={name} className="border-l-4 border-purple-500 pl-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {def.description}
                            </p>
                            {def.properties && renderProperties(def.properties)}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </section>

                {/* Selectors */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Components ({filteredSelectors.length})
                  </h2>
                  <div className="space-y-4">
                    {filteredSelectors.map(([name, data]) =>
                      renderSelector(name, data)
                    )}
                  </div>
                </section>

                {/* Examples */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Usage Examples
                  </h2>
                  <div className="space-y-6">
                    {Object.entries(schema.usage.examples).map(
                      ([name, example]: [string, any]) => (
                        <div key={name}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {example.description}
                          </p>
                          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                            <code>{JSON.stringify(example.props, null, 2)}</code>
                          </pre>
                        </div>
                      )
                    )}
                  </div>
                </section>

                {/* Reference */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Reference
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(schema.reference).map(
                      ([key, value]: [string, any]) => (
                        <div key={key}>
                          <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            {key}
                          </h3>
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-2">
                              {value.map((item: string) => (
                                <code
                                  key={item}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono"
                                >
                                  {item}
                                </code>
                              ))}
                            </div>
                          ) : typeof value === "object" ? (
                            <div className="space-y-2">
                              {Object.entries(value).map(([k, v]) => (
                                <div key={k} className="text-sm">
                                  <span className="font-medium text-gray-700">
                                    {k}:
                                  </span>{" "}
                                  <span className="text-gray-600">{String(v)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">{String(value)}</p>
                          )}
                        </div>
                      )
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

