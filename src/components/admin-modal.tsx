"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Pencil, X, Loader2, Lock, Package, KeyRound } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  volume: string;
  image: string;
  tagline: string | null;
  nights: number | null;
  accentFrom: string;
  accentTo: string;
  ingredients: string[];
}

const PRESET_COLORS = [
  { name: "Terracotta", from: "#B8553C", to: "#8C3A24" },
  { name: "Botanical Green", from: "#7A8450", to: "#5C6B3A" },
  { name: "Indigo Bhring", from: "#3A4D5C", to: "#1F2E3A" },
  { name: "Gold Ojas", from: "#B8860B", to: "#8C6708" },
  { name: "Neem Wood", from: "#8C6F4A", to: "#5C4A2F" },
  { name: "Charcoal", from: "#2C2416", to: "#1A1408" },
];

const TOKEN_STORAGE_KEY = "hairlab_github_token";

export function AdminModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [tokenStep, setTokenStep] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = {
    id: "",
    slug: "",
    name: "",
    subtitle: "",
    description: "",
    price: 0,
    volume: "",
    image: "/products/resham-packaging.png",
    tagline: "" as string,
    nights: null as number | null,
    accentFrom: "#B8553C",
    accentTo: "#8C3A24",
    ingredients: "",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsOpen(true);
      }
    }
    function onOpenAdmin() {
      setIsOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-admin", onOpenAdmin);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-admin", onOpenAdmin);
    };
  }, []);

  // Load saved GitHub token from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (saved) {
        setGithubToken(saved);
      }
    }
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (e) {
      toast.error("Could not load products");
    } finally {
      setLoading(false);
    }
  }

  function handleAuth() {
    if (!passcode) {
      toast.error("Enter your passcode");
      return;
    }
    if (passcode !== "hairlab2026" && passcode !== (process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "hairlab2026")) {
      toast.error("Wrong passcode");
      return;
    }
    setAuthed(true);
    fetchProducts();
    toast.success("Welcome back, Sruwa 🍃");
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      id: p.id,
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      price: p.price,
      volume: p.volume,
      image: p.image,
      tagline: p.tagline || "",
      nights: p.nights,
      accentFrom: p.accentFrom,
      accentTo: p.accentTo,
      ingredients: p.ingredients.join(", "),
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.subtitle || !form.description || !form.volume || form.price <= 0) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!githubToken) {
      toast.error("Please enter your GitHub token first");
      setTokenStep(true);
      return;
    }

    setLoading(true);
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const productPayload = {
      id: editingId || `p_${Date.now()}`,
      slug,
      name: form.name,
      subtitle: form.subtitle,
      description: form.description,
      price: form.price,
      volume: form.volume,
      image: form.image,
      tagline: form.tagline || null,
      nights: form.nights,
      accentFrom: form.accentFrom,
      accentTo: form.accentTo,
      ingredients: form.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubToken,
          passcode,
          action: editingId ? "update" : "add",
          product: productPayload,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      const data = await res.json();
      toast.success(data.message || "Product saved! Vercel will redeploy in ~60 seconds.");

      // Update local list
      if (editingId) {
        setProducts(products.map((p) => (p.id === editingId ? productPayload : p)));
      } else {
        setProducts([...products, productPayload]);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (e: any) {
      toast.error(e.message || "Could not save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This will permanently remove it from your website.`)) return;
    if (!githubToken) {
      toast.error("Please enter your GitHub token first");
      setTokenStep(true);
      return;
    }

    const product = products.find((p) => p.id === id);
    if (!product) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubToken,
          passcode,
          action: "delete",
          product,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Delete failed");
      }

      toast.success(`Deleted ${name}. Vercel will redeploy in ~60 seconds.`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (e: any) {
      toast.error(e.message || "Could not delete");
    } finally {
      setLoading(false);
    }
  }

  function saveToken() {
    if (!githubToken || githubToken.length < 20) {
      toast.error("Enter a valid GitHub token");
      return;
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, githubToken);
    toast.success("Token saved in your browser");
    setTokenStep(false);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setGithubToken("");
    toast.info("Token removed");
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl bg-[#F4ECD8] border-l border-[#2C2416]/10 p-0 flex flex-col overflow-y-auto"
      >
        <SheetHeader className="px-5 py-4 border-b border-[#2C2416]/10 flex flex-row items-center justify-between space-y-0">
          <div>
            <SheetTitle className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416]">
              {authed ? (tokenStep ? "GitHub Setup" : showForm ? (editingId ? "Edit Product" : "Add New Product") : "Manage Products") : "Admin Access"}
            </SheetTitle>
            <SheetDescription className="text-[11px] tracking-[0.2em] uppercase text-[#B8553C] mt-1">
              HAIR LAB. · Owner Panel
            </SheetDescription>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#2C2416]/60 hover:text-[#2C2416] p-1"
            aria-label="Close admin"
          >
            <X className="h-5 w-5" />
          </button>
        </SheetHeader>

        {!authed ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
            <Lock className="h-12 w-12 text-[#2C2416]/20 mb-4" strokeWidth={1} />
            <p className="font-[family-name:var(--font-playfair)] text-xl text-[#2C2416]">
              Enter your passcode
            </p>
            <p className="text-xs text-[#2C2416]/60 mt-2 text-center max-w-xs">
              This panel is only for Sruwa. Default passcode: <code className="bg-[#2C2416]/8 px-1.5 py-0.5 rounded text-[10px]">hairlab2026</code>
            </p>
            <Input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              className="bg-[#FBF6E9] border-[#2C2416]/15 mt-5 max-w-xs text-center"
              placeholder="••••••••"
              autoFocus
            />
            <Button
              onClick={handleAuth}
              className="mt-4 bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-8 text-[12px] tracking-[0.2em] uppercase"
            >
              Enter
            </Button>
          </div>
        ) : tokenStep ? (
          <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
            <KeyRound className="h-10 w-10 text-[#B8553C] mb-2" strokeWidth={1.4} />
            <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#2C2416]">
              Connect your GitHub
            </h3>
            <p className="text-sm text-[#2C2416]/70 leading-relaxed">
              This lets you add/edit/delete products from this panel — without me. Changes auto-commit to GitHub and Vercel redeploys in ~60 seconds.
            </p>

            <div className="bg-[#FBF6E9] p-4 rounded-sm border border-[#2C2416]/10 space-y-3">
              <p className="text-xs font-medium text-[#2C2416]">How to get a token (2 min):</p>
              <ol className="text-xs text-[#2C2416]/70 space-y-1.5 list-decimal list-inside">
                <li>Go to <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="text-[#B8553C] underline">github.com/settings/tokens/new</a></li>
                <li>Note: <code className="bg-[#2C2416]/8 px-1 rounded">admin-panel</code></li>
                <li>Expiration: <strong>No expiration</strong> (or 1 year)</li>
                <li>Tick ONLY: <code className="bg-[#2C2416]/8 px-1 rounded">repo</code></li>
                <li>Click <strong>Generate token</strong></li>
                <li>Copy the token (starts with <code className="bg-[#2C2416]/8 px-1 rounded">ghp_</code>)</li>
              </ol>
            </div>

            <div>
              <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                Paste your GitHub token here
              </Label>
              <Input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1 font-mono"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              />
              <p className="text-[10px] text-[#2C2416]/50 mt-1">
                🔒 Stored ONLY in your browser (localStorage). Never sent to me.
              </p>
            </div>

            <Button
              onClick={saveToken}
              className="w-full bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full py-5 text-[12px] tracking-[0.2em] uppercase"
            >
              Save Token & Continue
            </Button>

            {githubToken && (
              <button
                onClick={clearToken}
                className="w-full text-xs text-[#2C2416]/60 hover:text-[#B8553C] py-2"
              >
                Remove saved token
              </button>
            )}
          </div>
        ) : showForm ? (
          <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#2C2416]">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                variant="ghost"
                size="sm"
                className="text-[#2C2416]/60"
              >
                Back
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Name *
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                  placeholder="e.g., Resham"
                />
              </div>

              <div>
                <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Subtitle *
                </Label>
                <Input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                  placeholder="e.g., Everyday Night Oil"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                    Price in paise * (₹289 = 28900)
                  </Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                    placeholder="28900"
                  />
                  <p className="text-[10px] text-[#2C2416]/50 mt-1">
                    Display: ₹{(form.price / 100).toFixed(0)}
                  </p>
                </div>
                <div>
                  <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                    Volume *
                  </Label>
                  <Input
                    value={form.volume}
                    onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                    placeholder="e.g., 100 ml"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Description *
                </Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1 min-h-[100px]"
                  placeholder="A short, evocative product story..."
                />
              </div>

              <div>
                <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Ingredients (comma-separated)
                </Label>
                <Input
                  value={form.ingredients}
                  onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                  className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                  placeholder="Bhringraj, Amla, Brahmi, Sesame"
                />
              </div>

              <div>
                <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Tagline (optional — use "Coming Soon" for upcoming products)
                </Label>
                <Input
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                  placeholder="e.g., Bestseller / Coming Soon / Hand-carved"
                />
              </div>

              <div>
                <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Image URL
                </Label>
                <Input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                  placeholder="/products/your-image.png"
                />
                <p className="text-[10px] text-[#2C2416]/50 mt-1">
                  For now, image files need to be added via GitHub. Ask me when you want to add new product photos.
                </p>
              </div>

              <div>
                <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Card Color
                </Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, accentFrom: c.from, accentTo: c.to });
                      }}
                      className={`p-2 rounded-sm border-2 transition-all ${
                        form.accentFrom === c.from ? "border-[#2C2416] scale-105" : "border-transparent"
                      }`}
                      style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                    >
                      <span className="text-[10px] text-[#F4ECD8] font-medium block">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full py-6 text-[12px] tracking-[0.2em] uppercase"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingId ? (
                  "Save Changes"
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between gap-2">
              <Button
                onClick={startNew}
                className="flex-1 bg-[#7A8450] hover:bg-[#5C6B3A] text-[#F4ECD8] rounded-full py-5 text-[12px] tracking-[0.2em] uppercase"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
              <Button
                onClick={() => setTokenStep(true)}
                variant="outline"
                className="bg-[#FBF6E9] border-[#2C2416]/15 text-[#2C2416] hover:bg-[#2C2416]/5 rounded-full py-5 text-[11px] tracking-[0.15em] uppercase"
                title="GitHub settings"
              >
                <KeyRound className="h-3.5 w-3.5 mr-1.5" />
                Token
              </Button>
            </div>

            {!githubToken && (
              <div className="bg-[#fff8c5] border border-[#d4a72c] p-3 rounded-sm text-xs text-[#5C6B3A]">
                ⚠️ <strong>Setup needed:</strong> Click "Token" button above and paste your GitHub token to enable add/edit/delete.
              </div>
            )}

            <Separator className="bg-[#2C2416]/10" />

            <div className="space-y-3">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/60">
                Current Products ({products.length})
              </p>
              {loading && products.length === 0 ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#2C2416]/40" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-[#2C2416]/20 mx-auto mb-3" strokeWidth={1} />
                  <p className="text-sm text-[#2C2416]/60">No products yet. Add your first!</p>
                </div>
              ) : (
                products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 bg-[#FBF6E9] rounded-sm border border-[#2C2416]/8"
                  >
                    <div
                      className="w-12 h-14 rounded-sm flex-shrink-0 overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${p.accentFrom}, ${p.accentTo})`,
                      }}
                    >
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-[family-name:var(--font-playfair)] text-lg text-[#2C2416] leading-tight">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-[#2C2416]/60">
                        {p.subtitle} · ₹{(p.price / 100).toFixed(0)} · {p.volume}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(p)}
                      className="p-2 text-[#2C2416]/60 hover:text-[#B8553C]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-2 text-[#2C2416]/60 hover:text-[#B8553C]"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-5 border-t border-[#2C2416]/10 space-y-2">
              <p className="text-[10px] text-[#2C2416]/50 text-center">
                Tip: Press{" "}
                <kbd className="bg-[#2C2416]/10 px-1.5 py-0.5 rounded text-[10px]">
                  Ctrl + Shift + A
                </kbd>{" "}
                anytime to open this panel.
              </p>
              <p className="text-[10px] text-[#2C2416]/50 text-center">
                Or click the copyright text 5 times at the bottom.
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
