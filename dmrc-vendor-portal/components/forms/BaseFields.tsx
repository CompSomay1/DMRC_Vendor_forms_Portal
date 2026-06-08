"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

interface BaseFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function BaseFields({ form }: BaseFieldsProps) {
  const madeInIndia = form.watch("baseFields.madeInIndia");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">
          Company Information
        </h3>
        <p className="text-sm text-muted-foreground">
          Provide basic details about your company and product.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Company Name */}
        <FormField
          control={form.control}
          name="baseFields.companyName"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className="text-sm font-semibold">
                Company Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="company-name"
                  placeholder="Enter your company name"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role */}
        <FormField
          control={form.control}
          name="baseFields.role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Applying as <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger id="role-select" className="h-11">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MANUFACTURER">Manufacturer</SelectItem>
                  <SelectItem value="AUTHORISED_RESELLER">
                    Authorised Reseller
                  </SelectItem>
                  <SelectItem value="FABRICATOR">Fabricator</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Manufacturing Period */}
        <FormField
          control={form.control}
          name="baseFields.manufacturingPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Manufacturing Period (years){" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="manufacturing-period"
                  type="number"
                  min="0"
                  placeholder="e.g., 10"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Made in India */}
        <FormField
          control={form.control}
          name="baseFields.madeInIndia"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-4 sm:col-span-2">
              <FormControl>
                <Checkbox
                  id="made-in-india"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-semibold cursor-pointer">
                  Material / Item / Product is produced in India
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  If not produced in India, please specify the country below.
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* Country Name (conditional) */}
        {!madeInIndia && (
          <FormField
            control={form.control}
            name="baseFields.countryName"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-sm font-semibold">
                  Country of Origin{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="country-name"
                    placeholder="Enter country name"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Production Capacity */}
        <FormField
          control={form.control}
          name="baseFields.productionCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Production Capacity{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="production-capacity"
                  type="number"
                  min="0"
                  placeholder="e.g., 5000"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Production Capacity Unit */}
        <FormField
          control={form.control}
          name="baseFields.productionCapacityUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Unit <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="production-unit"
                  placeholder="e.g., units/month, tonnes/year"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lifespan */}
        <FormField
          control={form.control}
          name="baseFields.lifespan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Product Lifespan (years){" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="lifespan"
                  type="number"
                  min="0"
                  placeholder="e.g., 25"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
