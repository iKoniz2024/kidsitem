"use client";

import { useMemo, useState, useEffect } from "react";
import { Folder, ChevronRight, CheckCircle2 } from "lucide-react";

export default function CategorySelect({
  categories = [],
  value = "",
  onChange,
  error,
  label = "Category *",
  className = "",
}) {
  // Normalize categories list into root categories and subcategories mapping
  const { rootCategories, subCategoriesMap } = useMemo(() => {
    if (!Array.isArray(categories)) return { rootCategories: [], subCategoriesMap: new Map() };

    const roots = [];
    const subMap = new Map();

    categories.forEach((cat) => {
      // If it's a root category (no parentId, or parentId === null/empty)
      if (!cat.parentId) {
        roots.push(cat);
        const children = Array.isArray(cat.children) ? cat.children : [];
        subMap.set(cat.slug, children);
        subMap.set(String(cat._id), children);
      } else {
        // It has parentId
        const parent = categories.find((p) => String(p._id) === String(cat.parentId) || p.slug === cat.parentId);
        if (parent) {
          const existing = subMap.get(parent.slug) || [];
          if (!existing.some((c) => c.slug === cat.slug)) {
            subMap.set(parent.slug, [...existing, cat]);
            subMap.set(String(parent._id), [...existing, cat]);
          }
        }
      }
    });

    return { rootCategories: roots.length > 0 ? roots : categories, subCategoriesMap: subMap };
  }, [categories]);

  // Find initial parent and child based on current value slug or ID
  const { parentCat, childCat } = useMemo(() => {
    if (!value || !Array.isArray(categories)) {
      return { parentCat: null, childCat: null };
    }
    for (const cat of categories) {
      if (cat.slug === value || String(cat._id) === String(value)) {
        if (!cat.parentId) {
          return { parentCat: cat, childCat: null };
        } else {
          const parent = categories.find((p) => String(p._id) === String(cat.parentId) || p.slug === cat.parentId);
          return { parentCat: parent || cat, childCat: cat };
        }
      }
      if (Array.isArray(cat.children)) {
        const foundChild = cat.children.find((child) => child.slug === value || String(child._id) === String(value));
        if (foundChild) {
          return { parentCat: cat, childCat: foundChild };
        }
      }
    }
    return { parentCat: null, childCat: null };
  }, [value, categories]);

  const [selectedParentSlug, setSelectedParentSlug] = useState("");
  const [selectedChildSlug, setSelectedChildSlug] = useState("");

  // Sync internal state when `value` or `categories` change
  useEffect(() => {
    if (parentCat) {
      setSelectedParentSlug(parentCat.slug);
      setSelectedChildSlug(childCat ? childCat.slug : "");
    } else if (!value) {
      setSelectedParentSlug("");
      setSelectedChildSlug("");
    }
  }, [value, parentCat, childCat]);

  // Handle Main Category Change
  const handleParentChange = (e) => {
    const parentSlug = e.target.value;
    setSelectedParentSlug(parentSlug);
    setSelectedChildSlug("");
    if (onChange) {
      onChange(parentSlug);
    }
  };

  // Handle Subcategory Change
  const handleChildChange = (e) => {
    const childSlug = e.target.value;
    setSelectedChildSlug(childSlug);
    if (onChange) {
      // If child selected, use child slug. If child reset, fall back to parent slug.
      onChange(childSlug || selectedParentSlug);
    }
  };

  // Current active children list
  const activeChildren = useMemo(() => {
    if (!selectedParentSlug) return [];
    if (subCategoriesMap.has(selectedParentSlug)) {
      return subCategoriesMap.get(selectedParentSlug) || [];
    }
    const parent = categories.find((p) => p.slug === selectedParentSlug || String(p._id) === String(selectedParentSlug));
    return Array.isArray(parent?.children) ? parent.children : [];
  }, [selectedParentSlug, subCategoriesMap, categories]);

  const activeParent = useMemo(() => {
    if (!selectedParentSlug) return null;
    return (
      rootCategories.find(
        (p) => p.slug === selectedParentSlug || String(p._id) === String(selectedParentSlug)
      ) ||
      categories.find(
        (p) => p.slug === selectedParentSlug || String(p._id) === String(selectedParentSlug)
      ) ||
      parentCat
    );
  }, [selectedParentSlug, rootCategories, categories, parentCat]);

  const activeChild = useMemo(() => {
    if (!selectedChildSlug) return null;
    return (
      activeChildren.find(
        (c) => c.slug === selectedChildSlug || String(c._id) === String(selectedChildSlug)
      ) || childCat
    );
  }, [selectedChildSlug, activeChildren, childCat]);

  const hasChildren = activeChildren.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-foreground">
          {label}
        </label>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {/* Main Category Selector */}
        <div>
          <select
            value={selectedParentSlug}
            onChange={handleParentChange}
            className={`w-full rounded-lg border bg-background px-3 py-2 text-xs sm:text-sm outline-none transition-colors focus:border-ring ${
              error ? "border-destructive" : "border-border"
            }`}
          >
            <option value="">-- Select Main Category --</option>
            {rootCategories.map((parent, pIdx) => (
              <option key={parent._id || `${parent.slug}-${pIdx}`} value={parent.slug}>
                {parent.name || parent.slug}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Selector */}
        <div>
          <select
            value={selectedChildSlug}
            onChange={handleChildChange}
            disabled={!selectedParentSlug || !hasChildren}
            className={`w-full rounded-lg border bg-background px-3 py-2 text-xs sm:text-sm outline-none transition-colors focus:border-ring ${
              !selectedParentSlug || !hasChildren
                ? "opacity-60 cursor-not-allowed border-border"
                : error
                ? "border-destructive"
                : "border-border"
            }`}
          >
            {!selectedParentSlug ? (
              <option value="">Select Main Category First</option>
            ) : !hasChildren ? (
              <option value="">(No Subcategories)</option>
            ) : (
              <>
                <option value="">Select Subcategory (Optional)...</option>
                {activeChildren.map((child, cIdx) => (
                  <option key={child._id || `${selectedParentSlug}-${child.slug}-${cIdx}`} value={child.slug}>
                    ↳ {child.name || child.slug}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Selected Category Breadcrumb Badge */}
      {selectedParentSlug && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
          <span className="inline-flex items-center gap-1 font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            <Folder className="size-3" />
            {activeParent?.name || selectedParentSlug}
          </span>
          {selectedChildSlug && (
            <>
              <ChevronRight className="size-3 text-muted-foreground" />
              <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-accent px-2 py-0.5 rounded-md">
                <CheckCircle2 className="size-3 text-emerald-500" />
                {activeChild?.name || selectedChildSlug}
              </span>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
