import ProviderSetupClient from "@/components/setup/ProviderSetupClient";
import { getAllJobProviders } from "@/lib/supabase/queries";

export default async function ProvidersSetupPage() {
  // Fetch providers on the server
  const providers = await getAllJobProviders();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Job Providers Setup</h1>
      <p className="mb-6 text-gray-600">
        Select and configure the job providers you want to use for job scraping.
      </p>

      <ProviderSetupClient initialProviders={providers || []} />
    </div>
  );
}
