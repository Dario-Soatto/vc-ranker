import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const initialFunds = [
  { name: 'Sequoia Capital', website: 'https://www.sequoiacap.com', stage: 'multi' },
  { name: 'Andreessen Horowitz', website: 'https://a16z.com', stage: 'multi' },
  { name: 'Benchmark', website: 'https://www.benchmark.com', stage: 'early' },
  { name: 'Accel', website: 'https://www.accel.com', stage: 'early' },
  { name: 'Greylock Partners', website: 'https://greylock.com', stage: 'early' },
  { name: 'Kleiner Perkins', website: 'https://www.kleinerperkins.com', stage: 'multi' },
  { name: 'Lightspeed Venture Partners', website: 'https://lsvp.com', stage: 'multi' },
  { name: 'Index Ventures', website: 'https://www.indexventures.com', stage: 'early' },
  { name: 'Founders Fund', website: 'https://foundersfund.com', stage: 'early' },
  { name: 'NEA', website: 'https://www.nea.com', stage: 'multi' },
  { name: 'General Catalyst', website: 'https://www.generalcatalyst.com', stage: 'multi' },
  { name: 'GGV Capital', website: 'https://www.ggvc.com', stage: 'multi' },
  { name: 'Insight Partners', website: 'https://www.insightpartners.com', stage: 'late' },
  { name: 'Tiger Global', website: 'https://www.tigerglobal.com', stage: 'late' },
  { name: 'Coatue', website: 'https://www.coatue.com', stage: 'late' },
  { name: 'Thrive Capital', website: 'https://www.thrivecap.com', stage: 'early' },
  { name: 'Union Square Ventures', website: 'https://www.usv.com', stage: 'early' },
  { name: 'Khosla Ventures', website: 'https://www.khoslaventures.com', stage: 'multi' },
  { name: 'Spark Capital', website: 'https://www.sparkcapital.com', stage: 'early' },
  { name: 'Bessemer Venture Partners', website: 'https://www.bvp.com', stage: 'multi' },
  { name: 'Charles River Ventures', website: 'https://www.crv.com', stage: 'early' },
  { name: '8VC', website: 'https://www.8vc.com', stage: 'multi' },
  { name: 'Lux Capital', website: 'https://www.luxcapital.com', stage: 'early' },
  { name: 'Battery Ventures', website: 'https://www.battery.com', stage: 'multi' },
  { name: 'Redpoint Ventures', website: 'https://www.redpoint.com', stage: 'multi' },
  { name: 'First Round Capital', website: 'https://firstround.com', stage: 'early' },
  { name: 'Initialized Capital', website: 'https://initialized.com', stage: 'early' },
  { name: 'IVP', website: 'https://www.ivp.com', stage: 'multi' },
  { name: 'Menlo Ventures', website: 'https://www.menlovc.com', stage: 'multi' },
  { name: 'Norwest Venture Partners', website: 'https://www.nvp.com', stage: 'multi' },
  { name: 'Felicis Ventures', website: 'https://www.felicis.com', stage: 'multi' },
  { name: 'Ribbit Capital', website: 'https://www.ribbitcap.com', stage: 'multi' },
  { name: 'Iconiq Capital', website: 'https://www.iconiqcapital.com', stage: 'late' },
  { name: 'General Atlantic', website: 'https://www.generalatlantic.com', stage: 'late' },
  { name: 'TCV', website: 'https://www.tcv.com', stage: 'late' },
  { name: 'Summit Partners', website: 'https://www.summitpartners.com', stage: 'late' },
  { name: 'NFX', website: 'https://www.nfx.com', stage: 'early' },
  { name: 'Craft Ventures', website: 'https://www.craftventures.com', stage: 'early' },
  { name: 'ARCH Venture Partners', website: 'https://www.archventure.com', stage: 'early' },
  { name: 'Altos Ventures', website: 'https://www.altos.vc', stage: 'early' },
  { name: 'Forerunner Ventures', website: 'https://www.forerunnerventures.com', stage: 'early' },
  { name: 'B Capital Group', website: 'https://www.bcapgroup.com', stage: 'multi' },
  { name: 'Venrock', website: 'https://www.venrock.com', stage: 'multi' },
  { name: 'Bain Capital Ventures', website: 'https://www.baincapitalventures.com', stage: 'multi' },
  { name: 'Tribe Capital', website: 'https://tribecap.co', stage: 'multi' },
  { name: 'Canaan Partners', website: 'https://www.canaan.com', stage: 'multi' },
  { name: 'Costanoa Ventures', website: 'https://www.costanoavc.com', stage: 'early' },
  { name: 'Notable Capital', website: 'https://www.notablecapital.com', stage: 'multi' },
  { name: 'Madrona Ventures', website: 'https://www.madrona.com', stage: 'early' },
  { name: 'Meritech Capital', website: 'https://www.meritechcapital.com', stage: 'late' },
  { name: 'Greycroft', website: 'https://www.greycroft.com', stage: 'early' },
  { name: 'Foundation Capital', website: 'https://foundationcapital.com', stage: 'early' },
  { name: 'Mayfield Fund', website: 'https://www.mayfield.com', stage: 'multi' },
  { name: 'SignalFire', website: 'https://signalfire.com', stage: 'early' },
  { name: 'Scale Venture Partners', website: 'https://www.scalevp.com', stage: 'multi' },
  { name: 'Blackhorn Ventures', website: 'https://www.blackhornvc.com', stage: 'early' },
  { name: 'True Ventures', website: 'https://trueventures.com', stage: 'early' },
  { name: 'Fifth Wall', website: 'https://fifthwall.com', stage: 'multi' },
  { name: 'Soma Capital', website: 'https://www.somacap.com', stage: 'early' },
  { name: 'HOF Capital', website: 'https://hofcapital.com', stage: 'multi' },
  { name: 'Flybridge', website: 'https://www.flybridge.com', stage: 'early' },
  { name: 'Foothill Ventures', website: 'https://foothill.ventures', stage: 'early' },
  { name: 'Sutter Hill Ventures', website: 'https://www.shv.com', stage: 'early' },
  { name: 'Greenoaks', website: 'https://www.greenoaks.com', stage: 'late' },
  { name: 'Upfront Ventures', website: 'https://www.upfront.com', stage: 'early' },
  { name: 'Kindred Ventures', website: 'https://kindredventures.com', stage: 'early' },
  { name: 'Floodgate', website: 'https://www.floodgate.com', stage: 'early' },
  { name: 'BoxGroup', website: 'https://www.boxgroup.com', stage: 'early' },
  { name: 'BOND', website: 'https://www.bondcap.com', stage: 'late' },
  { name: 'Pear VC', website: 'https://www.pear.vc', stage: 'early' },
  { name: 'Primary Venture Partners', website: 'https://www.primary.vc', stage: 'early' },
  { name: 'Obvious Ventures', website: 'https://obvious.com', stage: 'early' },
  { name: 'Abstract Ventures', website: 'https://www.abstractvc.com/', stage: 'early' },
  { name: 'Susa Ventures', website: 'https://www.susaventures.com/', stage: 'early' },
];

export async function GET(request: Request) {
  try {
    // Check secret from query parameter
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing secret' },
        { status: 401 }
      );
    }

    // STEP 1: Save existing logo URLs
    const existingLogos = await sql`
      SELECT name, logo_url FROM funds WHERE logo_url IS NOT NULL
    `;
    
    // Create a map of name -> logo_url
    const logoMap = new Map(
      existingLogos.rows.map(row => [row.name, row.logo_url])
    );

    console.log(`Preserving ${logoMap.size} existing logos`);

    // STEP 2: Delete all existing data and reset
    await sql`DELETE FROM funds`;
    await sql`ALTER SEQUENCE funds_id_seq RESTART WITH 1`;

    // STEP 3: Insert funds with preserved logos
    for (const fund of initialFunds) {
      const logoUrl = logoMap.get(fund.name) || null;
      
      await sql`
        INSERT INTO funds (name, website, stage, logo_url, elo_score)
        VALUES (${fund.name}, ${fund.website}, ${fund.stage}, ${logoUrl}, 1000)
      `;
      
      if (logoUrl) {
        console.log(`✓ ${fund.name}: Restored logo`);
      }
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully with preserved logos',
      count: initialFunds.length,
      logosPreserved: logoMap.size
    }, { status: 200 });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}