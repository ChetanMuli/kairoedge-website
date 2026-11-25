import { query } from "./db.js";

const realisticImages = {
  services: {
    "cloud-devops": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    "web-engineering": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    "ai-automation": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    "mobile-products": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    "cybersecurity": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    "data-analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    "it-consulting": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
  },
  projects: {
    "northline-control-tower": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    "helio-ledger": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    "fieldline-assist": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
    "vivid-storefront": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    "pulse-ward-insights": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
    "orbit-field": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
  },
  industries: {
    "healthcare": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    "fintech": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    "logistics": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    "retail": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80",
    "education": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
    "enterprise": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    "agritech": "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80",
    "startups": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
  },
  team: {
    "Cloud architecture": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    "Product engineering": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    "Data engineering": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    "Delivery leadership": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80"
  }
};

async function main() {
  console.log("Expanding image column lengths if needed...");
  try {
    await query("ALTER TABLE services MODIFY COLUMN image TEXT");
    await query("ALTER TABLE projects MODIFY COLUMN image TEXT");
    await query("ALTER TABLE industries MODIFY COLUMN image TEXT");
    await query("ALTER TABLE team MODIFY COLUMN image TEXT");
  } catch (err) {
    console.log("Column modification note:", err.message);
  }

  console.log("Updating services images...");
  for (const [slug, url] of Object.entries(realisticImages.services)) {
    await query("UPDATE services SET image = ? WHERE slug = ?", [url, slug]);
  }

  console.log("Updating projects images...");
  for (const [slug, url] of Object.entries(realisticImages.projects)) {
    await query("UPDATE projects SET image = ? WHERE slug = ?", [url, slug]);
  }

  console.log("Updating industries images...");
  for (const [slug, url] of Object.entries(realisticImages.industries)) {
    await query("UPDATE industries SET image = ? WHERE slug = ?", [url, slug]);
  }

  console.log("Updating team images...");
  for (const [role, url] of Object.entries(realisticImages.team)) {
    await query("UPDATE team SET image = ? WHERE role = ?", [url, role]);
  }

  console.log("Realistic images successfully applied to MySQL database!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
