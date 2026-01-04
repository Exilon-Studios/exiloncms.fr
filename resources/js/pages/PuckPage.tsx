import React from "react";
import PuckLayout from "@/layouts/PuckLayout";
import { Head } from "@inertiajs/react";
import { Render, type Data } from "@measured/puck";
import { puckConfig } from "@/puck/config";
import "@measured/puck/puck.css";

interface PuckPageProps {
  page: {
    id: number;
    title: string;
    slug: string;
    puck_data: Data;
  };
}

export default function PuckPage({ page }: PuckPageProps) {
  return (
    <PuckLayout>
      <Head title={page.title} />

      {page.puck_data ? (
        <Render config={puckConfig} data={page.puck_data} />
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {page.title}
          </h1>
          <p className="text-muted-foreground">
            Cette page n'a pas encore de contenu.
          </p>
        </div>
      )}
    </PuckLayout>
  );
}
