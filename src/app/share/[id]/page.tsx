"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { ResumeData, TemplateId } from "@/lib/types";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { ExecutiveTemplate } from "@/components/templates/ExecutiveTemplate";

export default function SharePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResumeData | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>("modern");

  useEffect(() => {
    if (!id) return;

    const fetchSharedResume = async () => {
      try {
        const res = await fetch(`/api/share-resume/${id}`);
        if (!res.ok) {
          throw new Error("Failed to load shared resume. It may have been deleted or the link is invalid.");
        }
        const json = await res.json();
        setData(json.content_json);
        setTemplateId(json.template_id || "modern");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Loading shared resume...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Unavailable</h1>
          <p className="text-slate-500 text-sm mb-6">{error || "This resume is not available."}</p>
        </div>
      </div>
    );
  }

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    bold: BoldTemplate,
    executive: ExecutiveTemplate,
  }[templateId] || ModernTemplate;

  return (
    <div className="min-h-screen bg-slate-100 py-10 print:py-0 print:bg-white flex justify-center">
      <div className="w-full max-w-[794px] bg-white shadow-lg print:shadow-none min-h-[1056px]">
        <TemplateComponent data={data} />
      </div>
    </div>
  );
}
