// Seeding” a database means inserting some initial data into it — like planting seeds 🌾 in an empty garden so it has something to grow from.

import { PrismaClient } from '@prisma/client';  // the main object that lets you talk to the database (insert, read, update, delete).
import { componentRegistry } from '../src/lib/componentRegistry'; // list of predefined components

const prisma = new PrismaClient();  // This line connects to your database.

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing components
  await prisma.component.deleteMany({});  // Before inserting new data, delete everything that’s already in the component table.
  console.log('🗑️  Cleared existing components');

  // Add components from registry
  for (const comp of componentRegistry) { // loop through each component in your registry, for each component, Insert a new row into the Component table with this data.
    await prisma.component.create({
      data: {
        id: comp.id,
        name: comp.name,
        description: comp.description,
        category: comp.category,
        tags: comp.tags,
        filePath: comp.filePath,
        componentPath: comp.componentPath,
        code: comp.code,
        dependencies: comp.dependencies || [],
        responsive: comp.responsive,
        darkMode: comp.darkMode,
      },
    });
    console.log(`✅ Added: ${comp.name}`);
  }

  console.log(`\n🎉 Successfully seeded ${componentRegistry.length} components!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
