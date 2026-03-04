"use client";
import { useState } from "react";
import { useDentalStore } from "@/lib/dentalStore";
import Header          from "@/components/layout/Header";
import ChartLayout     from "@/components/layout/ChartLayout";
import ConsultationView from "@/components/consultation/ConsultationView";

export default function Home() {
  const appView = useDentalStore((s) => s.appView);
  const [isLayoutEditMode, setIsLayoutEditMode] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-950">
      <Header
        isLayoutEditMode={isLayoutEditMode}
        onToggleLayoutEdit={() => setIsLayoutEditMode((prev) => !prev)}
      />

      {appView === "chart" ? (
        <ChartLayout isLayoutEditMode={isLayoutEditMode} />
      ) : (
        <ConsultationView />
      )}
    </div>
  );
}
