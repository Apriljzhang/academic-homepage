const BLOG_NAME = "Reflexivity in Research, Learning, and Teaching-AJZ";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function monthAbbrev(n: number): string {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  return months[Math.max(0, Math.min(11, n))];
}

function escapeBibTex(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/"/g, '\\"');
}

function safeKeyPart(value: string): string {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
  return cleaned || "post";
}

export function buildPostUrl(origin: string, slug: string): string {
  const base = origin.replace(/\/+$/, "");
  return `${base}/blog/${encodeURIComponent(slug)}/`;
}

export function formatApa7BlogCitation(title: string, publishedAt: string, postUrl: string): string {
  const d = new Date(publishedAt);
  const datePart = Number.isNaN(d.getTime())
    ? "n.d."
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `Zhang, A. J. (${datePart}). ${title}. ${BLOG_NAME}. ${postUrl}`;
}

export function formatBibTexBlogCitation(title: string, publishedAt: string, slug: string, postUrl: string): string {
  const d = new Date(publishedAt);
  const year = Number.isNaN(d.getTime()) ? "n.d." : String(d.getFullYear());
  const month = Number.isNaN(d.getTime()) ? "jan" : monthAbbrev(d.getMonth());
  const day = Number.isNaN(d.getTime()) ? "1" : String(d.getDate());
  const key = `zhang${year}${safeKeyPart(slug)}`;
  return [
    `@misc{${key},`,
    `  author = {Zhang, April Jiawei},`,
    `  title = {${escapeBibTex(title)}},`,
    `  year = {${year}},`,
    `  month = {${month}},`,
    `  day = {${day}},`,
    `  howpublished = {${escapeBibTex(BLOG_NAME)}},`,
    `  url = {${escapeBibTex(postUrl)}}`,
    `}`,
  ].join("\n");
}

export async function copyBlogCitation(title: string, publishedAt: string, slug: string): Promise<void> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const postUrl = buildPostUrl(origin, slug);
  const apa = formatApa7BlogCitation(title, publishedAt, postUrl);
  const bib = formatBibTexBlogCitation(title, publishedAt, slug, postUrl);
  const payload = `APA 7th\n${apa}\n\nBibTeX\n${bib}`;
  await navigator.clipboard.writeText(payload);
}
