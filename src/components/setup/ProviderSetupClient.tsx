"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Provider = {
  id: string;
  name: string;
  slug: string;
  config_schema: Record<string, any>;
  is_active: boolean;
  created_at: string;
};

interface ProviderSetupClientProps {
  initialProviders: Provider[];
}

export default function ProviderSetupClient({
  initialProviders,
}: ProviderSetupClientProps) {
  const [providers] = useState<Provider[]>(initialProviders);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [providerConfig, setProviderConfig] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    // Initialize config with default values from schema
    const initialConfig = {};
    if (provider.config_schema) {
      Object.keys(provider.config_schema).forEach((key) => {
        (initialConfig as Record<string, any>)[key] =
          (provider.config_schema as Record<string, { default?: any }>)[key]
            ?.default ?? "";
      });
    }
    setProviderConfig(initialConfig);
  };

  const handleConfigChange = (key: string, value: any) => {
    setProviderConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveConfig = async () => {
    if (!selectedProvider) return;

    setSaving(true);
    try {
      // Here you would save the provider config to your database
      // For example:
      // await saveProviderConfig(selectedProvider.id, providerConfig);
      showToast(
        `${selectedProvider.name} configuration saved successfully`,
        "success"
      );
      setSelectedProvider(null);
    } catch (error) {
      console.error("Failed to save provider config:", error);
      showToast("Failed to save provider configuration", "error");
    } finally {
      setSaving(false);
    }
  };

  // Simple toast function to replace sonner
  const showToast = (message: string, type: "success" | "error" | "info") => {
    // In a real implementation, you might want to use a different toast library
    // or implement a custom toast component
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const renderConfigFields = () => {
    if (!selectedProvider || !selectedProvider.config_schema) return null;

    return Object.entries(selectedProvider.config_schema).map(
      ([key, schema]) => (
        <div key={key} className="mb-4">
          <label
            htmlFor={key}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {schema.label || key}
          </label>
          <input
            id={key}
            type={schema.type || "text"}
            placeholder={schema.placeholder || ""}
            value={providerConfig[key] || ""}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {schema.description && (
            <p className="text-sm text-gray-500 mt-1">{schema.description}</p>
          )}
        </div>
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Providers</h2>
        {providers.length === 0 ? (
          <p>No job providers available.</p>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {provider.name}
                    </h3>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id={`toggle-${provider.id}`}
                        checked={provider.is_active}
                        onChange={() =>
                          showToast(
                            "Provider status toggle functionality will be implemented",
                            "info"
                          )
                        }
                        className="sr-only"
                      />
                      <label
                        htmlFor={`toggle-${provider.id}`}
                        className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                          provider.is_active ? "bg-indigo-600" : ""
                        }`}
                      >
                        <span
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                            provider.is_active ? "transform translate-x-4" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{provider.slug}</p>
                </div>
                <div className="p-4">
                  <button
                    onClick={() => handleProviderSelect(provider)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {selectedProvider ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Configure {selectedProvider.name}
              </h3>
              <p className="text-sm text-gray-500">
                Set up the required configuration for this provider
              </p>
            </div>
            <div className="p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveConfig();
                }}
              >
                {renderConfigFields()}
                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProvider(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      saving ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {saving && (
                      <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <p className="text-center text-gray-500">
              Select a provider to configure its settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
