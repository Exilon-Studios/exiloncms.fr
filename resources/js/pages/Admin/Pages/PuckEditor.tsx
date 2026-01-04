import React, { useState } from "react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Puck, type Data } from "@measured/puck";
import { puckConfig } from "@/puck/config";
import "@measured/puck/puck.css";
import { Button } from "@/components/ui/button";

interface PuckEditorProps {
  page: {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    puck_data: Data | null;
  };
}

export default function PuckEditor({ page }: PuckEditorProps) {
  const [saving, setSaving] = useState(false);

  // Parse existing Puck data or create initial data
  const initialData: Data = page.puck_data || {
    content: [],
    root: {
      props: {
        title: page.title,
        description: "",
      },
    },
  };

  const handlePublish = async (data: Data) => {
    setSaving(true);

    try {
      router.put(
        route("admin.pages.update", page.id),
        {
          puck_data: JSON.stringify(data),
          title: page.title, // Include title to pass validation
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            console.log("Page saved successfully");
          },
          onError: (errors) => {
            console.error("Error saving page:", errors);
          },
          onFinish: () => {
            setSaving(false);
          },
        }
      );
    } catch (error) {
      console.error("Error publishing:", error);
      setSaving(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Éditer ${page.title} - Puck Editor`} />

      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Éditeur Puck - {page.title}
            </h1>
            <p className="text-sm text-muted-foreground">/pages/{page.slug}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit(route("admin.pages.index"))}
          >
            Retour aux pages
          </Button>
        </div>

        {/* Puck Editor */}
        <div className="flex-1 overflow-hidden">
          <Puck
            config={puckConfig}
            data={initialData}
            onPublish={handlePublish}
            headerTitle={page.title}
            headerPath={`/pages/${page.slug}`}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
