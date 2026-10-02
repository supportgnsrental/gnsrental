// Editorial content shared by the showroom, navigation and dedicated landing pages.
const categories = [
 ['chairs','Chairs',['gold-chiavari-chair','white-folding-chair'],'gold-chiavari-chair.webp','A beautiful seat for every guest.'],
 ['tables','Tables',['round-table','banquet-table','cocktail-table'],'round-table.webp','Bring everyone together, from intimate dinners to grand receptions.'],
 ['linens-napkins','Linens & Napkins',['white-linen', 'black-table-skirt', 'navy-pintuck-120-round-tablecloth', 'eggplant-polyester-19-napkin'],'gns-black-table-skirt.webp','Soft textures and thoughtful finishing touches for your tablescape.'],
 ['charger-plates','Charger Plates',['gold-rim-charger'],'gns-charger-tablescape.webp','Frame each place setting with a finishing touch.'],
 ['dinnerware','Dinnerware',['dinnerware-setting'],'gns-dinnerware-setting.webp','Create a welcoming place at the table for every guest.'],
 ['flatware','Flatware',[],'gns-charger-tablescape.webp','The little details that complete a beautifully coordinated table.'],
 ['glassware','Glassware',['water-goblet'],'water-goblet.webp','Raise a glass to the moments worth remembering.'],
 ['catering-chafers','Chafing Dishes & Catering',['gold-round-chafer', 'gold-9l-chafer', 'rose-gold-chafer', 'floral-serving-bowl'],'gns-gold-round-chafer.webp','Thoughtful serving pieces for a celebration shared over food.'],
 ['centerpieces-vases','Centerpieces & Vases',[],'gold-arch.webp','Add shape, height and personality to your celebration.'],
 ['backdrops-arches','Backdrops & Arches',['gold-arch'],'gold-arch.webp','Set the scene for your ceremony and your favorite photographs.'],
 ['pedestals-displays','Pedestals & Display Stands',[],'cocktail-table.webp','Give your most beautiful details a place to shine.'],
 ['cake-dessert-displays','Cake & Dessert Displays',['floral-serving-bowl'],'gns-floral-serving-bowl.webp','Make the sweetest part of the celebration feel special.'],
 ['lounge-specialty','Lounge & Specialty Furniture',[],'gold-chiavari-chair.webp','Invite your guests to gather, settle in and celebrate.'],
 ['decor-accessories','Décor & Accessories',[],'gold-arch.webp','Bring your vision together with thoughtful finishing touches.'],
 ['tabletop','Tabletop',['gold-rim-charger', 'dinnerware-setting', 'floral-serving-bowl', 'white-linen', 'water-goblet', 'eggplant-polyester-19-napkin'],'gns-dinnerware-setting.webp','Layer linens, glassware and details into a setting that feels like you.'],
 ['specialty-rentals','Specialty Rentals',['white-canopy','patio-heater','cooler','red-catering-cooler','waste-bin','extension-cord'],'gns-red-cooler-open-upright.webp','Comfort and practical essentials for a beautifully considered occasion.']
].map(([slug,name,ids,image,copy])=>({slug,name,ids,image,copy}));
const celebrations = [
 ['weddings','Weddings','A setting for your forever.','From your ceremony to your final toast, bring your wedding vision together with thoughtfully selected seating, tables, linens and beautiful details.','gns-dinnerware-setting.webp',['gold-chiavari-chair','round-table','white-linen','water-goblet','gold-arch'],'Wedding'],
 ['nikkah-walimat','Nikkah & Walimat','Two families. A beautiful beginning.','Create a welcoming setting for your Nikkah or Walimat-ul-Nikkah. Share your ceremony, dining and venue requirements so we can help shape a rental list around your celebration.','gns-nikkah-celebration.webp',['gold-arch','gold-chiavari-chair','round-table','white-linen','water-goblet'],'Walimat-ul-Nikkah'],
 ['birthdays-milestones','Birthdays & Milestones','Another chapter worth celebrating.','Gather the people you love for birthdays, anniversaries and milestones with pieces that make the occasion feel personal.','gns-dinnerware-setting.webp',['cocktail-table','round-table','gold-chiavari-chair','white-linen'],'Birthday'],
 ['baby-bridal-showers','Baby & Bridal Showers','Beautiful beginnings, shared together.','From an intimate shower to a larger gathering, create a thoughtful setting for welcoming a new chapter with family and friends.','gns-dinnerware-setting.webp',['round-table','white-folding-chair','white-linen','water-goblet','gold-arch'],'Baby / bridal shower'],
 ['graduations','Graduations','A proud moment. A joyful gathering.','Celebrate hard work and new beginnings with welcoming seating, dining tables and outdoor event essentials.','gns-dinnerware-setting.webp',['white-folding-chair','banquet-table','white-canopy','cooler'],'Graduation'],
 ['corporate-events','Corporate Events','Make a thoughtful impression.','Plan a professional, welcoming gathering with practical seating, tables, linens and essentials tailored to your venue and guest count.','gns-dinnerware-setting.webp',['banquet-table','cocktail-table','white-linen','water-goblet'],'Corporate event'],
 ['cultural-celebrations','Cultural Celebrations','Your traditions. Your celebration.','Bring people together in a setting that honors your traditions. Tell us about your celebration, colors and service needs so we can help coordinate the details.','gns-dinnerware-setting.webp',['gold-chiavari-chair','round-table','white-linen','water-goblet','gold-arch'],'Cultural celebration']
].map(([slug,name,tag,copy,image,ids,occasion])=>({slug,name,tag,copy,image,ids,occasion}));
const steps = [
 ['Browse','Explore the GNS rental collection.'],
 ['Build your quote','Choose your favorite pieces and quantities.'],
 ['Tell us about your event','Give us your date, location, guest count and delivery needs.'],
 ['We confirm','Our team reviews availability and prepares your personalized quote.'],
 ['Reserve','Complete your agreement and required payment to secure your rentals.'],
 ['Celebrate','We’ll handle the rentals while you enjoy your special occasion.']
];
const difference = [
 ['Thoughtfully Selected Pieces','Pieces chosen for beauty, versatility and memorable celebrations.'],
 ['Personal Service','We’re a family-owned business and believe every celebration deserves thoughtful attention.'],
 ['Beautifully Coordinated Collections','Rent individual pieces or let us help you create a coordinated look.'],
 ['Delivery & Setup Options','Services tailored to the requirements of your event.'],
 ['Celebrations of Every Kind','From intimate dinners to weddings, cultural celebrations and milestone occasions.']
];
const story = [
 'GNS Event Rentals began long before we ever thought of it as a business.',
 'For years, we—Ben and Heavn—have shared a genuine love for entertaining, celebrating and creating beautiful spaces for the people we love. Whether we were decorating for our granddaughter’s birthday, celebrating graduations and milestone birthdays, hosting family and friends, or preparing for one of our children’s weddings, we have always enjoyed the details that make an occasion feel special.',
 'And over the years, something else happened: we started collecting.',
 'A beautiful serving piece here. A unique table setting there. Special décor we couldn’t resist. Items we discovered while traveling or preparing for another family celebration. Before we knew it, our collection had grown into an assortment of distinctive pieces gathered from different places and different chapters of our family’s life.',
 'Then, as we began preparing for our own upcoming wedding anniversary celebration, we found ourselves doing it all over again—searching for beautiful pieces, purchasing unique items and imagining how everything would come together.',
 'That was when we realized something:',
 'Why keep all of this beauty to ourselves?',
 'What had always been a passion could become something we shared with other families.',
 'And that is how GNS Event Rentals—Ben N Heavn—was born.',
 'GNS is an extension of something we’ve already been doing for years: bringing people together and making life’s special moments beautiful.',
 'We understand that celebrations aren’t simply about tables, chairs, linens or décor. They’re about the people gathered around those tables. They’re about welcoming family from near and far, watching a child graduate, celebrating another year of life, witnessing two families come together through marriage, and creating memories that will be talked about for years to come.',
 'That’s the heart behind GNS.',
 'We’ve carefully selected pieces that we would be proud to use at our own celebrations, and we want our customers to feel that same sense of excitement when planning theirs.',
 'From intimate family gatherings to weddings, anniversaries, birthdays, graduations, cultural celebrations and grand occasions, we’re honored to help provide the pieces that bring your vision together.',
 'Because at GNS Event Rentals, we’re not just renting items for an event. We’re helping set the scene for a memory.'
];
module.exports={categories,celebrations,steps,difference,story};
