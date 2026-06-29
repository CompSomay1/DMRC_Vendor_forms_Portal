import { VendorApplication } from "@/types/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ViewApplicationProps {
  application: VendorApplication;
}

export function ViewApplication({ application }: ViewApplicationProps) {
  const formData = (application.formData as Record<string, any>) || {};
  
  // Extract known base fields
  const baseFieldKeys = [
    "companyName", "role", "manufacturingPeriod", "madeInIndia", 
    "countryName", "productionCapacity", "productionCapacityUnit", "lifespan"
  ];
  
  const baseFields = Object.keys(formData)
    .filter(key => baseFieldKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = formData[key];
      return obj;
    }, {} as Record<string, any>);

  const categoryFields = Object.keys(formData)
    .filter(key => !baseFieldKeys.includes(key) && key !== "category")
    .reduce((obj, key) => {
      obj[key] = formData[key];
      return obj;
    }, {} as Record<string, any>);

  // Helper to format keys like "manufacturingPeriod" to "Manufacturing Period"
  const formatLabel = (key: string) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  // Helper to safely render values
  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined || value === "") return <span className="text-muted-foreground italic">N/A</span>;
    if (typeof value === "boolean") return value ? <span className="text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Yes</span> : <span className="text-destructive font-medium flex items-center gap-1"><XCircle className="h-4 w-4"/> No</span>;
    if (typeof value === "string" && (value.startsWith("http") || value.startsWith("/uploads"))) {
      return (
        <a href={value} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-dmrc-blue hover:underline">
          <FileText className="h-4 w-4" /> View Document
        </a>
      );
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-muted-foreground italic">None</span>;
      return (
        <div className="space-y-4 w-full">
          {value.map((item, idx) => (
            <div key={idx} className="bg-muted/30 p-3 rounded-lg border border-border/50 text-sm">
              {typeof item === "object" && item !== null ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(item).map(([k, v]) => {
                    // Ignore empty fields in array objects if they are empty strings
                    if (v === "" || v === null) return null;
                    return (
                      <div key={k} className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium">{formatLabel(k)}</span>
                        <span className="break-words">{renderValue(v)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                renderValue(item)
              )}
            </div>
          ))}
        </div>
      );
    }
    if (typeof value === "object" && value !== null) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {Object.entries(value).map(([k, v]) => {
            if (v === "" || v === null) return null;
            return (
              <div key={k} className="flex flex-col">
                <span className="text-sm text-muted-foreground font-medium mb-1">{formatLabel(k)}</span>
                <span className="text-sm">{renderValue(v)}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return <span className="break-words">{String(value)}</span>;
  };

  // Group fields roughly by type to make it cleaner
  const primitiveFields = Object.entries(categoryFields)
    .filter(([_, v]) => typeof v !== "object" || v === null)
    .sort((a, b) => a[0].localeCompare(b[0]));
    
  const complexFields = Object.entries(categoryFields)
    .filter(([_, v]) => typeof v === "object" && v !== null && (!Array.isArray(v) || v.length > 0))
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="space-y-8 pb-12">
      <Card className="border-t-4 border-t-dmrc-blue shadow-md">
        <CardHeader className="bg-muted/10 pb-4">
          <CardTitle className="text-lg">Company Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Company Name</p>
              <p className="font-semibold text-lg">{baseFields.companyName || application.companyName || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <Badge variant="outline" className="text-dmrc-blue border-dmrc-blue/30 bg-dmrc-blue/5">
                {application.category}
              </Badge>
            </div>
            {Object.entries(baseFields).filter(([k]) => k !== "companyName").map(([k, v]) => (
              <div key={k} className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{formatLabel(k)}</p>
                <div>{renderValue(v)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="bg-muted/10 pb-4">
          <CardTitle className="text-lg">General Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            {primitiveFields.map(([k, v]) => {
              if (v === "" || v === null) return null;
              return (
                <div key={k} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{formatLabel(k)}</p>
                  <div className="text-sm font-medium">{renderValue(v)}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {complexFields.map(([k, v]) => (
        <Card key={k} className="shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 py-3 border-b border-border/50">
            <CardTitle className="text-md font-semibold text-dmrc-blue">{formatLabel(k)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {renderValue(v)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
