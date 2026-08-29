import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || '';
  const category = searchParams.get('category') || '';

  try {
    const root = path.resolve(process.cwd(), '..');
    const invPath = path.join(root, 'registry', 'pc-inventory.json');
    if (fs.existsSync(invPath)) {
      const inventory = JSON.parse(fs.readFileSync(invPath, 'utf8'));
      
      let skills = inventory.skills || [];
      if (filter) {
        skills = skills.filter((s: any) => 
          (s.slug && s.slug.includes(filter.toLowerCase())) ||
          (s.description && s.description.toLowerCase().includes(filter.toLowerCase()))
        );
      }
      if (category) {
        skills = skills.filter((s: any) => s.category?.toLowerCase() === category.toLowerCase());
      }

      return NextResponse.json({
        timestamp: inventory.timestamp,
        summary: inventory.summary,
        totalFiltered: skills.length,
        skills: skills.slice(0, 50),
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'PC Inventory not yet built. Run `loragent discover` to populate.' });
}
