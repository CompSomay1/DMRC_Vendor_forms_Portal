"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

interface ArchitectureFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function ArchitectureFields({ form }: ArchitectureFieldsProps) {
  const { fields: projects, append: addProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "categoryFields.projects",
  });

  const suppliedToDmrc = form.watch("categoryFields.suppliedToDmrc");
  const sriApplicable = form.watch("categoryFields.sriApplicable");
  const greenCertified = form.watch("categoryFields.greenCertified");
  const govRegistered = form.watch("categoryFields.govRegistered");

  return (
    <div className="space-y-8">
      {/* Section A: Material / Item Details */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-600 text-xs font-bold text-white">
            A
          </div>
          <h3 className="text-lg font-semibold">Material / Item Details</h3>
        </div>

        <FormField
          control={form.control}
          name="categoryFields.materialItem"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Material / Item / Product <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select material / item / product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A1_FLOORING_RAISED_FLOOR">A1 – Flooring – Raised Floor</SelectItem>
                  <SelectItem value="A2_FLOORING_TILES">A2 – Flooring – Tiles</SelectItem>
                  <SelectItem value="A3_CLADDING_ACP">A3 – Cladding – ACP</SelectItem>
                  <SelectItem value="A4_CLADDING_STONE">A4 – Cladding – Stone</SelectItem>
                  <SelectItem value="A5_CEILING_METAL">A5 – Ceiling – Metal</SelectItem>
                  <SelectItem value="A6_GLAZING_DGU">A6 – Glazing – DGU</SelectItem>
                  <SelectItem value="A7_ROOFING_STANDING_SEAM">A7 – Roofing – Standing Seam</SelectItem>
                  <SelectItem value="A8_PAINTING_EXTERIOR">A8 – Painting – Exterior</SelectItem>
                  <SelectItem value="A9_WATERPROOFING">A9 – Waterproofing</SelectItem>
                  <SelectItem value="A10_SEALANT_ADHESIVE">A10 – Sealant & Adhesive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <Separator />

      {/* Section B: Qualifying Criteria */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-600 text-xs font-bold text-white">
            B
          </div>
          <h3 className="text-lg font-semibold">Qualifying Criteria</h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryFields.isCodeConformance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Relevant IS Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., IS 15622:2006" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.internationalCodeConformance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">International Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., BS EN 13964" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.nablAccredited"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-semibold cursor-pointer">
                  Tested in NABL accredited laboratory
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.isoCertified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-semibold cursor-pointer">
                  ISO Certified
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </section>

      <Separator />

      {/* Section C: Additional Information */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-400 text-xs font-bold text-white">
            C
          </div>
          <h3 className="text-lg font-semibold">Additional Information</h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Green Certification */}
          <FormField
            control={form.control}
            name="categoryFields.greenCertified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-semibold cursor-pointer">
                  Green certified (GRIHA / LEED / IGBC)
                </FormLabel>
              </FormItem>
            )}
          />

          {greenCertified && (
            <FormField
              control={form.control}
              name="categoryFields.greenCertOrganisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Certifying Organisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Organisation name" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Government Registration */}
          <FormField
            control={form.control}
            name="categoryFields.govRegistered"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-semibold cursor-pointer">
                  Registered with Government / PSU organisation
                </FormLabel>
              </FormItem>
            )}
          />

          {govRegistered && (
            <FormField
              control={form.control}
              name="categoryFields.govOrganisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Organisation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Organisation name" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Application Area */}
          <FormField
            control={form.control}
            name="categoryFields.applicationArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Application Area</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INTERIOR">Interior</SelectItem>
                    <SelectItem value="EXTERIOR">Exterior</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* C&D Waste */}
          <FormField
            control={form.control}
            name="categoryFields.usesCD_waste"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-semibold cursor-pointer">
                  Produced using C&D waste
                </FormLabel>
              </FormItem>
            )}
          />

          {/* SRI */}
          <FormField
            control={form.control}
            name="categoryFields.sriApplicable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-semibold cursor-pointer">
                  Solar Reflectance Index (SRI) applicable
                </FormLabel>
              </FormItem>
            )}
          />

          {sriApplicable && (
            <FormField
              control={form.control}
              name="categoryFields.sriValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">SRI Value</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 78" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </section>

      <Separator />

      {/* Projects */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-600 text-xs font-bold text-white">
              P
            </div>
            <div>
              <h3 className="text-lg font-semibold">Project Details</h3>
              <p className="text-xs text-muted-foreground">
                Government, PSU, or Private sector projects (max 5, last 5 years)
              </p>
            </div>
          </div>
          {projects.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                addProject({
                  organisationName: "",
                  amount: "",
                  currency: "INR",
                  completionDate: "",
                })
              }
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          )}
        </div>

        {projects.map((field, index) => (
          <div key={field.id} className="relative rounded-lg border border-border/50 bg-muted/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Project #{index + 1}</span>
              {projects.length > 0 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeProject(index)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name={`categoryFields.projects.${index}.organisationName`}
                render={({ field: ff }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Organisation Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="Organisation name" className="h-10" {...ff} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name={`categoryFields.projects.${index}.amount`}
                render={({ field: ff }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Amount (incl. GST) <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input type="number" placeholder="Amount" className="h-10" {...ff} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name={`categoryFields.projects.${index}.currency`}
                render={({ field: ff }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Currency <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={ff.onChange} defaultValue={ff.value}>
                      <FormControl><SelectTrigger className="h-10"><SelectValue placeholder="Currency" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name={`categoryFields.projects.${index}.completionDate`}
                render={({ field: ff }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Completion Date <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input type="date" className="h-10" {...ff} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </section>

      <Separator />

      {/* DMRC Projects */}
      <section className="space-y-5">
        <FormField
          control={form.control}
          name="categoryFields.suppliedToDmrc"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="text-sm font-semibold cursor-pointer">
                  Has the material been supplied / used in DMRC projects?
                </FormLabel>
                <p className="text-xs text-muted-foreground">If yes, additional project details will be required.</p>
              </div>
            </FormItem>
          )}
        />

        {suppliedToDmrc && (
          <div className="rounded-lg border border-dmrc-blue/20 bg-dmrc-blue/5 p-4">
            <p className="text-sm font-medium text-dmrc-blue mb-3">
              DMRC Project Details (max 5 entries)
            </p>
            <p className="text-xs text-muted-foreground">
              Contract details will be captured in the full submission. The form UI for repeatable DMRC project entries is ready for integration.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
