import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Paisley Christmas Markets database...');

  // 1. 清空旧数据（保证重复运行安全）
  await prisma.traderApplication.deleteMany();
  await prisma.festiveEvent.deleteMany();
  await prisma.stall.deleteMany();
  await prisma.marketZone.deleteMany();
  await prisma.user.deleteMany();

  // 2. 创建演示账号（密码经 bcrypt 加密）
  const adminPassword = await bcrypt.hash('Admin2026!', 10);
  const traderPassword = await bcrypt.hash('Trader2026!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Market Organiser Admin',
      email: 'admin@paisleychristmas.uk',
      passwordHash: adminPassword,
      role: 'admin',
      businessName: 'Paisley WinterFest Events Ltd',
      consentGiven: true,
      consentAt: new Date(),
    },
  });

  const demoTrader = await prisma.user.create({
    data: {
      name: 'Heidi Mueller',
      email: 'trader@paisleychristmas.uk',
      passwordHash: traderPassword,
      role: 'trader',
      businessName: 'Black Forest Bakery Co.',
      consentGiven: true,
      consentAt: new Date(),
    },
  });

  // 3. 创建佩斯利 4 个核心圣诞集市区域（真实经纬度）
  const abbeyZone = await prisma.marketZone.create({
    data: {
      name: 'Paisley Abbey Bavarian Village',
      city: 'Paisley',
      description:
        'Set against the illuminated 12th-century Paisley Abbey, featuring authentic wooden German chalets, Glühwein taverns, and traditional brass bands.',
      address: 'Abbey Close, Paisley PA1 1JG',
      lat: 55.8451,
      lng: -4.4203,
      openDates: '27 Nov – 24 Dec 2026 | 10:00 – 21:00',
    },
  });

  const countyZone = await prisma.marketZone.create({
    data: {
      name: 'County Square Food & Glühwein Plaza',
      city: 'Paisley',
      description:
        'Right outside Paisley Gilmour Street Station, welcoming visitors with sizzling Bratwurst grills, Scottish hot chocolate, and covered timber seating.',
      address: 'County Square, Paisley PA1 1BN',
      lat: 55.8468,
      lng: -4.4242,
      openDates: '27 Nov – 24 Dec 2026 | 10:00 – 22:00',
    },
  });

  const dunnZone = await prisma.marketZone.create({
    data: {
      name: 'Dunn Square Artisan Crafts Quarter',
      city: 'Paisley',
      description:
        'A curated riverside promenade celebrating Renfrewshire makers, Paisley-pattern woollens, hand-carved Erzgebirge ornaments, and festive gifts.',
      address: 'Dunn Square, Paisley PA1 1EW',
      lat: 55.8442,
      lng: -4.4227,
      openDates: '27 Nov – 23 Dec 2026 | 10:00 – 19:30',
    },
  });

  const highStZone = await prisma.marketZone.create({
    data: {
      name: 'High Street Winter Fairground & Stage',
      city: 'Paisley',
      description:
        'Family-friendly zone hosting the vintage Victorian carousel, Santa’s Grotto, community choir performances, and wreath-making workshops.',
      address: 'High Street, Paisley PA1 2AF',
      lat: 55.8458,
      lng: -4.4265,
      openDates: '27 Nov – 24 Dec 2026 | 11:00 – 20:30',
    },
  });

  // 4. 创建初始摊位
  await prisma.stall.createMany({
    data: [
      {
        name: 'Nürnberg Bratwurst & Pretzel Grill',
        category: 'German Specialities',
        description: 'Oak-smoked Bavarian Bratwurst, Currywurst, and freshly baked salted Laugenbrezeln.',
        chaletNumber: 'A-01',
        priceRange: '££',
        zoneId: abbeyZone.id,
      },
      {
        name: 'Abbey Spiced Glühwein & Cider House',
        category: 'Food & Drink',
        description: 'Traditional German mulled red wine, alcohol-free Kinderpunsch, and Scottish spiced apple cider served in collectible Paisley mugs.',
        chaletNumber: 'A-04',
        priceRange: '£',
        zoneId: abbeyZone.id,
      },
      {
        name: 'Clyde Valley Raclette & Fondue Chalet',
        category: 'Food & Drink',
        description: 'Melted Alpine cheese scraped over baby potatoes, pickles, and crusty sourdough.',
        chaletNumber: 'C-02',
        priceRange: '££',
        zoneId: countyZone.id,
      },
      {
        name: 'Stollen & Lebkuchen Bakehouse',
        category: 'German Specialities',
        description: 'Hand-iced gingerbread hearts, Dresden-style Christstollen, and warm cinnamon churros.',
        chaletNumber: 'C-05',
        priceRange: '£',
        zoneId: countyZone.id,
      },
      {
        name: 'Paisley Pattern Tartan & Knitwear',
        category: 'Artisan Crafts',
        description: 'Locally woven lambswool scarves, shawls, and festive stockings inspired by Paisley’s textile heritage.',
        chaletNumber: 'D-03',
        priceRange: '£££',
        zoneId: dunnZone.id,
      },
      {
        name: 'Erzgebirge Woodcraft & Candle Pyramids',
        category: 'Gifts & Decor',
        description: 'Authentic German nutcrackers, wooden smoking men (Räuchermänner), and hand-blown glass baubles.',
        chaletNumber: 'D-07',
        priceRange: '££',
        zoneId: dunnZone.id,
      },
      {
        name: 'Renfrewshire Beeswax & Pine Candles',
        category: 'Gifts & Decor',
        description: 'Small-batch soy and beeswax candles infused with Highland pine, clove, and orange peel.',
        chaletNumber: 'H-02',
        priceRange: '£',
        zoneId: highStZone.id,
      },
    ],
  });

  // 5. 创建节日活动排期
  await prisma.festiveEvent.createMany({
    data: [
      {
        title: 'Grand Christmas Lights Switch-On & Lantern Parade',
        description: 'Opening night lantern procession from High Street to Paisley Abbey with pipe bands and fireworks.',
        eventDate: new Date('2026-11-27T17:30:00Z'),
        category: 'Parade',
        zoneId: abbeyZone.id,
      },
      {
        title: 'Bavarian Oompah & Brass Band Live',
        description: 'Festive German folk tunes and Christmas carols performed live under the Abbey arches.',
        eventDate: new Date('2026-12-05T18:00:00Z'),
        category: 'Live Music',
        zoneId: abbeyZone.id,
      },
      {
        title: 'Scottish Pine Wreath-Making Workshop',
        description: 'Guided 90-minute craft session with local florists; all greenery and ribbons included.',
        eventDate: new Date('2026-12-12T13:00:00Z'),
        category: 'Workshop',
        zoneId: dunnZone.id,
      },
      {
        title: 'Santa’s Grotto & Storytelling Cabin',
        description: 'Family visits with Santa, festive storytelling, and a small wooden keepsake gift for every child.',
        eventDate: new Date('2026-12-19T11:00:00Z'),
        category: 'Family',
        zoneId: highStZone.id,
      },
    ],
  });

  // 6. 创建初始商户申请记录（供管理员后台演示审核流程）
  await prisma.traderApplication.createMany({
    data: [
      {
        businessName: 'Black Forest Bakery Co.',
        contactName: 'Heidi Mueller',
        email: 'trader@paisleychristmas.uk',
        phone: '+44 7700 900412',
        category: 'German Specialities',
        chaletSize: 'Food Chalet with Power (£980)',
        description: 'Freshly baked Black Forest gateau slices, Apfelstrudel with warm vanilla custard, and roasted chestnuts.',
        hygieneCertRef: 'REN-FH-2026-8841',
        gdprConsent: true,
        status: 'pending',
        zoneId: abbeyZone.id,
        userId: demoTrader.id,
      },
      {
        businessName: 'Loch Lomond Ceramics',
        contactName: 'Callum MacLeod',
        email: 'callum@lochlomondceramics.co.uk',
        phone: '+44 7700 900755',
        category: 'Artisan Crafts',
        chaletSize: 'Standard 3x2m (£450)',
        description: 'Hand-thrown stoneware mugs, winter table centrepieces, and bespoke Paisley-motif ceramic ornaments.',
        gdprConsent: true,
        status: 'pending',
        zoneId: dunnZone.id,
      },
      {
        businessName: 'Highland Honey & Fudge',
        contactName: 'Fiona Fraser',
        email: 'fiona@highlandhoney.co.uk',
        phone: '+44 7700 900219',
        category: 'Food & Drink',
        chaletSize: 'Standard 3x2m (£450)',
        description: 'Scottish heather honey jars, whisky tablet, and gingerbread fudge gift boxes.',
        hygieneCertRef: 'REN-FH-2026-5520',
        gdprConsent: true,
        status: 'approved',
        adminNotes: 'Approved for County Square entrance chalet.',
        zoneId: countyZone.id,
      },
    ],
  });

  console.log(`Seed complete! Admin: ${admin.email} | Demo Trader: ${demoTrader.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });