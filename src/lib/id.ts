export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function topicId(category: string, month: string, title: string): string {
  return `${slugify(category)}__${slugify(month)}__${slugify(title)}`
}
