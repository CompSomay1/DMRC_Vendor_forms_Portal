"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface CertificateRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  index: number;
  fieldPrefix: string; // e.g. "categoryFields.isCodes"
  textFields: { name: string; label: string; placeholder: string }[];
  onRemove: () => void;
  applicationId: string;
  documentType: string;
  fileFieldName?: string; // defaults to "certificateUrl"
}

export function CertificateRow({
  form,
  index,
  fieldPrefix,
  textFields,
  onRemove,
  applicationId,
  documentType,
  fileFieldName = "certificateUrl",
}: CertificateRowProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileUrl = form.watch(`${fieldPrefix}.${index}.${fileFieldName}`);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("documentType", documentType);

      const response = await fetch(`/api/applications/${applicationId}/documents`, {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "File upload failed.");
        return;
      }

      toast.success("Document uploaded successfully!");
      form.setValue(`${fieldPrefix}.${index}.${fileFieldName}`, data.document.fileUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative border border-border/50 bg-muted/5 p-4 rounded-xl space-y-4 md:space-y-0 md:flex md:items-end md:gap-4 transition-all hover:bg-muted/10">
      {textFields.map((tf) => (
        <div key={tf.name} className="flex-1 min-w-[150px]">
          <FormField
            control={form.control}
            name={`${fieldPrefix}.${index}.${tf.name}`}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-semibold text-foreground">{tf.label} <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder={tf.placeholder} className="h-10 text-sm bg-background border-border/80" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      ))}

      <div className="flex-1 min-w-[150px]">
        <FormField
          control={form.control}
          name={`${fieldPrefix}.${index}.validTill`}
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-foreground">Valid Till <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="date" className="h-10 text-sm bg-background border-border/80" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      <div className="flex-1 min-w-[180px]">
        <FormItem className="space-y-1.5">
          <FormLabel className="text-xs font-semibold text-foreground">Supporting Document <span className="text-destructive">*</span></FormLabel>
          <div className="flex items-center gap-2">
            {fileUrl ? (
              <div className="flex items-center gap-2 w-full h-10 border border-emerald-200/60 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 rounded-md text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate hover:underline flex-1"
                >
                  View PDF
                </a>
                <label className="cursor-pointer text-xs font-bold text-dmrc-blue hover:text-dmrc-blue-light transition-colors shrink-0">
                  Replace
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border/80 hover:border-dmrc-blue hover:bg-background rounded-md cursor-pointer text-xs font-medium text-muted-foreground transition-all">
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-dmrc-blue" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    Upload PDF
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
          <FormField
            control={form.control}
            name={`${fieldPrefix}.${index}.${fileFieldName}`}
            render={({ fieldState }) => (
              fieldState.error ? (
                <p className="text-xs font-medium text-destructive mt-1">{fieldState.error.message}</p>
              ) : <></>
            )}
          />
        </FormItem>
      </div>

      <div className="flex justify-end pt-2 md:pt-0 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
