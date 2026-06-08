"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface CivilFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function CivilFields({ form }: CivilFieldsProps) {
  const { fields: purchaseOrders, append: addPO, remove: removePO } = useFieldArray({
    control: form.control,
    name: "categoryFields.purchaseOrders",
  });

  const { fields: completionCerts, append: addCert, remove: removeCert } = useFieldArray({
    control: form.control,
    name: "categoryFields.completionCertificates",
  });

  const { fields: financialYears, append: addFY, remove: removeFY } = useFieldArray({
    control: form.control,
    name: "categoryFields.financialYears",
  });

  return (
    <div className="space-y-8">
      {/* Section B: Qualifying Criteria */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-dmrc-blue text-xs font-bold text-white">
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
                <FormLabel className="text-sm font-semibold">
                  Relevant IS Code
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., IS 1786:2008"
                    className="h-11"
                    {...field}
                  />
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
                <FormLabel className="text-sm font-semibold">
                  International Code (BS / ASTM / AISI / ANSI)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., ASTM A615"
                    className="h-11"
                    {...field}
                  />
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
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
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
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
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

      {/* Section D: Purchase / Work Orders */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-dmrc-blue text-xs font-bold text-white">
              D
            </div>
            <div>
              <h3 className="text-lg font-semibold">Purchase / Work Orders</h3>
              <p className="text-xs text-muted-foreground">
                Minimum 1, maximum 5 entries required
              </p>
            </div>
          </div>
          {purchaseOrders.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                addPO({
                  clientType: "",
                  clientName: "",
                  totalValue: "",
                  currency: "INR",
                  totalQuantity: "",
                  unit: "",
                  issuanceDate: "",
                })
              }
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Order
            </Button>
          )}
        </div>

        {purchaseOrders.map((field, index) => (
          <div
            key={field.id}
            className="relative rounded-lg border border-border/50 bg-muted/10 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                Order #{index + 1}
              </span>
              {purchaseOrders.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePO(index)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name={`categoryFields.purchaseOrders.${index}.clientType`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Client Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="METRO_RAILWAYS">Metro / Railways</SelectItem>
                        <SelectItem value="GOVT">Government / Semi Govt.</SelectItem>
                        <SelectItem value="PSU">PSU / SPV</SelectItem>
                        <SelectItem value="PRIVATE_LISTED">Private (NSE/BSE Listed)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`categoryFields.purchaseOrders.${index}.clientName`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Client Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Client name" className="h-10" {...formField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`categoryFields.purchaseOrders.${index}.totalValue`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Total Value <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Value" className="h-10" {...formField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`categoryFields.purchaseOrders.${index}.currency`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Currency <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                      </FormControl>
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

              <FormField
                control={form.control}
                name={`categoryFields.purchaseOrders.${index}.issuanceDate`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Issuance Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="h-10" {...formField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </section>

      <Separator />

      {/* Section D.2: Completion Certificates */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-dmrc-gold text-xs font-bold text-white">
              C
            </div>
            <div>
              <h3 className="text-lg font-semibold">Completion Certificates</h3>
              <p className="text-xs text-muted-foreground">
                From Metro / Railways / Government organisations (last 5 years)
              </p>
            </div>
          </div>
          {completionCerts.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                addCert({
                  clientType: "",
                  clientName: "",
                  certificateDate: "",
                })
              }
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Certificate
            </Button>
          )}
        </div>

        {completionCerts.map((field, index) => (
          <div
            key={field.id}
            className="relative rounded-lg border border-border/50 bg-muted/10 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                Certificate #{index + 1}
              </span>
              {completionCerts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCert(index)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name={`categoryFields.completionCertificates.${index}.clientType`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Client Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="METRO_RAILWAYS">Metro / Railways</SelectItem>
                        <SelectItem value="GOVT">Government / Semi Govt.</SelectItem>
                        <SelectItem value="PSU">PSU / SPV</SelectItem>
                        <SelectItem value="PRIVATE_LISTED">Private (NSE/BSE Listed)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`categoryFields.completionCertificates.${index}.clientName`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Client Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Client name" className="h-10" {...formField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`categoryFields.completionCertificates.${index}.certificateDate`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Certificate Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="h-10" {...formField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </section>

      <Separator />

      {/* Section E: Quality Plan */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-dmrc-blue text-xs font-bold text-white">
            E
          </div>
          <h3 className="text-lg font-semibold">Quality Plan & Certification</h3>
        </div>

        <FormField
          control={form.control}
          name="categoryFields.qualityPlanDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Brief Quality Plan Details
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe quality checks and tests conducted on raw material, bought-out items, stage-wise quality checks, etc."
                  className="min-h-[100px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <Separator />

      {/* Section F: Financial Data */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-dmrc-gold text-xs font-bold text-white">
              F
            </div>
            <div>
              <h3 className="text-lg font-semibold">Financial Data</h3>
              <p className="text-xs text-muted-foreground">
                Profit & Loss Statements and Balance Sheets for the last 3 financial years
              </p>
            </div>
          </div>
          {financialYears.length < 3 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addFY({ financialYear: "" })}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Year
            </Button>
          )}
        </div>

        {financialYears.map((field, index) => {
          const currentYear = new Date().getFullYear();
          return (
            <div
              key={field.id}
              className="flex items-end gap-4 rounded-lg border border-border/50 bg-muted/10 p-4"
            >
              <FormField
                control={form.control}
                name={`categoryFields.financialYears.${index}.financialYear`}
                render={({ field: formField }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs font-semibold">
                      Financial Year <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={`${currentYear - 1}-${String(currentYear).slice(2)}`}>
                          {currentYear - 1} – {String(currentYear).slice(2)}
                        </SelectItem>
                        <SelectItem value={`${currentYear - 2}-${String(currentYear - 1).slice(2)}`}>
                          {currentYear - 2} – {String(currentYear - 1).slice(2)}
                        </SelectItem>
                        <SelectItem value={`${currentYear - 3}-${String(currentYear - 2).slice(2)}`}>
                          {currentYear - 3} – {String(currentYear - 2).slice(2)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {financialYears.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFY(index)}
                  className="h-10 w-10 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </section>

      <Separator />

      {/* Section H: Undertakings */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-dmrc-blue text-xs font-bold text-white">
            H
          </div>
          <h3 className="text-lg font-semibold">Undertakings</h3>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="categoryFields.undertaking_a"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm cursor-pointer">
                    (a) This application is in accordance with the relevant standard(s). <span className="text-destructive">*</span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.undertaking_b_servicePeriod"
            render={({ field }) => (
              <FormItem className="rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormLabel className="text-sm">
                  (b) The material / item / product is a proven one and has been in service for: <span className="text-destructive">*</span>
                </FormLabel>
                <div className="flex items-center gap-2 mt-2">
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Years"
                      className="h-10 w-32"
                      {...field}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">years</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.undertaking_c"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm cursor-pointer">
                    (c) We shall provide technical support during the lifetime of the material / item / product. <span className="text-destructive">*</span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.undertaking_d"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm cursor-pointer">
                    (d) We shall comply with all conditions of DMRC&apos;s Vendor Policy including Annexures A, B, C, D and E. <span className="text-destructive">*</span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.undertaking_e"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm cursor-pointer">
                    (e) We are aware that despite inclusion in the vendor list, we are liable to submit technical compliances. <span className="text-destructive">*</span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryFields.undertaking_f"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm cursor-pointer">
                    (f) All statements, information, and answers are true and no information has been suppressed. <span className="text-destructive">*</span>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>
    </div>
  );
}
