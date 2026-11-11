
// CampusOS seed data: campuses, CBT question bank, marketplace, events, timetable
const CAMPUSES = {
  "UNILAG": {
    name: "University of Lagos", short: "UNILAG", city: "Akoka, Lagos",
    places: [
      {id:"unilag-gate", name:"Main Gate", x:30, y:88, type:"gate", note:"Main entrance, security check"},
      {id:"unilag-library", name:"Central Library", x:38, y:58, type:"library", note:"Open 8am-10pm, quiet floors 3-5"},
      {id:"unilag-lt", name:"Lecture Theatre (LT)", x:52, y:52, type:"lecture", note:"Big hall, many 100-level classes"},
      {id:"unilag-arts", name:"Faculty of Arts", x:66, y:44, type:"faculty", note:"Arts, Music, Theatre Arts"},
      {id:"unilag-sci", name:"Faculty of Science", x:70, y:66, type:"faculty", note:"Science block, labs on 2nd floor"},
      {id:"unilag-caf", name:"Students' Cafeteria", x:46, y:74, type:"food", note:"Rice, swallow, small chops, POS available"},
      {id:"unilag-hostel", name:"Honours Hostel", x:24, y:40, type:"hostel", note:"Female hostel, near lagoon front"},
      {id:"unilag-stadium", name:"Sports Complex", x:82, y:80, type:"sports", note:"Football pitch, gym, track"},
      {id:"unilag-lagoon", name:"Lagoon Front", x:12, y:22, type:"landmark", note:"Sunset spot, cooler in the evening"},
      {id:"unilag-bursary", name:"Bursary / Fees Office", x:58, y:78, type:"office", note:"School fees, receipts, clearance"}
    ]
  },
  "OAU": {
    name: "Obafemi Awolowo University", short: "OAU", city: "Ile-Ife, Osun",
    places: [
      {id:"oau-gate", name:"Main Gate", x:50, y:90, type:"gate", note:"Entrance from Mayflower Avenue"},
      {id:"oau-library", name:"Obafemi Awolowo Library", x:46, y:60, type:"library", note:"Mega library, 24h during exams"},
      {id:"oau-owena", name:"Odaludu Lecture Theatre", x:54, y:48, type:"lecture", note:"Rusty theatre, most lectures"},
      {id:"oau-caf", name:"Mozambique Hall / Caf", x:38, y:72, type:"food", note:"Food court, bookshop nearby"},
      {id:"oau-aj", name:"AJ Lodge / Hostels", x:30, y:36, type:"hostel", note:"Hostel area, enter via Gate 3"},
      {id:"oau-sci", name:"Science Complex", x:66, y:56, type:"faculty", note:"Science, Technology, Pharmacy"},
      {id:"oau-stadium", name:"Sports Complex", x:78, y:70, type:"sports", note:"Main field, track, indoor hall"}
    ]
  },
  "UI": {
    name: "University of Ibadan", short: "UI", city: "Ibadan, Oyo",
    places: [
      {id:"ui-gate", name:"UI Main Gate", x:48, y:90, type:"gate", note:"University Road entrance"},
      {id:"ui-library", name:"Kenneth Dike Library", x:50, y:62, type:"library", note:"Oldest university library in Nigeria"},
      {id:"ui-trench", name:"Trinity / Trenchard Hall", x:44, y:50, type:"lecture", note:"Main lecture halls"},
      {id:"ui-caf", name:"Cafeteria", x:56, y:42, type:"food", note:"Balanced diet, jollof Fridays"},
      {id:"ui-queens", name:"Queens Hall", x:32, y:34, type:"hostel", note:"Female hostel"},
      {id:"ui-sci", name:"Faculty of Science", x:68, y:52, type:"faculty", note:"Science faculty block"},
      {id:"ui-zoo", name:"UI Zoo", x:72, y:26, type:"landmark", note:"Zoo inside campus (yes, really)"}
    ]
  },
  "UNAB": {
    name: "Federal University of Agriculture Abeokuta", short: "FUNAAB", city: "Abeokuta, Ogun",
    places: [
      {id:"fun-gate", name:"Main Gate", x:46, y:90, type:"gate", note:"Alabata Road entrance"},
      {id:"fun-library", name:"Nimbe Adedipe Library", x:50, y:60, type:"library", note:"Central library"},
      {id:"fun-lt", name:"Lecture Theatre", x:56, y:46, type:"lecture", note:"Main LT"},
      {id:"fun-caf", name:"Cafeteria", x:40, y:70, type:"food", note:"Campus food court"},
      {id:"fun-sci", name:"COLNAS / Science", x:64, y:58, type:"faculty", note:"Agriculture and science colleges"},
      {id:"fun-hostel", name:"Student Hostels", x:28, y:38, type:"hostel", note:"Hostel blocks A-D"}
    ]
  }
};

// CBT question bank: each {subject, topic, q, options[4], answer index, explain}
const QUESTIONS = [
  {subject:"Mathematics", topic:"Algebra", q:"If f(x) = 2x + 3 and g(x) = x^2 - 1, what is f(g(2))?", options:["7","11","13","9"], answer:3, explain:"g(2) = 2^2 - 1 = 3, then f(3) = 2(3) + 3 = 9"},
  {subject:"Mathematics", topic:"Algebra", q:"Solve for x: x^2 - 5x + 6 = 0", options:["x=1 or 6","x=2 or 3","x=-2 or -3","x=5 or 1"], answer:1, explain:"(x-2)(x-3)=0 so x=2 or x=3"},
  {subject:"English", topic:"Comprehension", q:"Choose the option nearest in meaning to 'abundant':", options:["scarce","plentiful","rare","meagre"], answer:1, explain:"Abundant means existing in large quantities, same as plentiful"},
  {subject:"English", topic:"Grammar", q:"Neither of the answers ___ correct.", options:["are","is","were","be"], answer:1, explain:"'Neither' is singular, takes 'is'"},
  {subject:"Physics", topic:"Mechanics", q:"A car travels 100m in 5s from rest. Its average speed is:", options:["5 m/s","10 m/s","20 m/s","50 m/s"], answer:2, explain:"Average speed = distance/time = 100/5 = 20 m/s"},
  {subject:"Physics", topic:"Waves", q:"The SI unit of frequency is:", options:["metre","newton","hertz","joule"], answer:2, explain:"Frequency is measured in hertz (Hz)"},
  {subject:"Chemistry", topic:"Atomic Structure", q:"The atomic number of carbon is 6. How many electrons are in its outer shell?", options:["2","4","6","8"], answer:1, explain:"Carbon electron config is 2,4 so outer shell has 4"},
  {subject:"Chemistry", topic:"Acids & Bases", q:"pH of a neutral solution at 25C is:", options:["0","1","7","14"], answer:2, explain:"Neutral solutions have pH 7"},
  {subject:"Biology", topic:"Cell Biology", q:"Which organelle is known as the powerhouse of the cell?", options:["Nucleus","Ribosome","Mitochondrion","Golgi body"], answer:2, explain:"Mitochondria produce most of the cell's ATP energy"},
  {subject:"Biology", topic:"Genetics", q:"In a monohybrid cross Aa x Aa, the phenotypic ratio is:", options:["1:1","3:1","9:3:3:1","1:2:1"], answer:1, explain:"Tall:short = 3:1 phenotypically, genotypic 1:2:1"},
  {subject:"CRS", topic:"New Testament", q:"Who baptized Jesus in the River Jordan?", options:["Peter","John the Baptist","Paul","James"], answer:1, explain:"Matthew 3:13-17, John the Baptist baptized Jesus"},
  {subject:"CRS", topic:"Old Testament", q:"How many days did God take to create the heavens and earth in Genesis?", options:["3","5","6","7"], answer:2, explain:"Genesis 1: God created in six days and rested on the seventh"},
  {subject:"Computer Science", topic:"Programming", q:"What does HTML stand for?", options:["HyperText Markup Language","HighText Machine Language","Hyperlink Text Mode Language","Home Tool Markup Language"], answer:0, explain:"HTML = HyperText Markup Language"},
  {subject:"Computer Science", topic:"Data Structures", q:"Which data structure uses LIFO (last in, first out)?", options:["Queue","Stack","Array","Linked list"], answer:1, explain:"Stacks are LIFO, queues are FIFO"},
  {subject:"Economics", topic:"Microeconomics", q:"Opportunity cost is best defined as:", options:["Money spent","Value of the next best alternative forgone","Total cost of production","Cost of raw materials"], answer:1, explain:"Opportunity cost = value of the forgone alternative"},
  {subject:"Government", topic:"Nigeria", q:"Nigeria gained independence from Britain in which year?", options:["1957","1960","1963","1966"], answer:1, explain:"Nigeria became independent on 1 October 1960"},
  {subject:"Mathematics", topic:"Geometry", q:"Area of a triangle with base 10cm and height 6cm is:", options:["30 cm2","60 cm2","120 cm2","16 cm2"], answer:0, explain:"Area = 1/2 x base x height = 1/2 x 10 x 6 = 30 cm2"},
  {subject:"English", topic:"Vocabulary", q:"'Candid' is nearest in meaning to:", options:["deceptive","frank","silent","rude"], answer:1, explain:"Candid means truthful and straightforward, i.e. frank"},
  {subject:"Physics", topic:"Electricity", q:"Ohm's law is V = IR. If V=12V and R=4 ohms, current is:", options:["48 A","3 A","0.33 A","16 A"], answer:1, explain:"I = V/R = 12/4 = 3 A"},
  {subject:"Biology", topic:"Ecology", q:"Photosynthesis takes place mainly in which part of the leaf?", options:["Stomata","Mesophyll cells","Veins","Epidermis"], answer:1, explain:"Chloroplasts in mesophyll cells do photosynthesis"}
];

const SEED_LISTINGS = [
  {id:"l1", title:"Used Calculus Textbook (Stewart)", price:4500, cat:"Books", seller:"Amaka O.", campus:"UNILAG", cond:"Good", note:"Cover slightly bent, all pages complete", phone:"2348012345678"},
  {id:"l2", title:"HP Laptop i5 8GB RAM 256GB SSD", price:185000, cat:"Gadgets", seller:"David K.", campus:"UNILAG", cond:"Very good", note:"Battery 6hrs, charger included", phone:"2348098765432"},
  {id:"l3", title:"Past Questions MTH 201 (2020-2024)", price:800, cat:"Books", seller:"Chidi E.", campus:"UNILAG", cond:"New", note:"With solutions, PDF + print", phone:"2348055511223"},
  {id:"l4", title:"Mini Fridge 80L Double Door", price:75000, cat:"Hostel", seller:"Sarah B.", campus:"UNILAG", cond:"Good", note:"Cold well, selling because of graduation", phone:"2348077788990"},
  {id:"l5", title:"Laundry & Ironing Service (24hr)", price:1500, cat:"Services", seller:"Grace Laundry", campus:"UNILAG", cond:"Service", note:"Pickup at hostel gate, per basket", phone:"2348033344556"},
  {id:"l6", title:"Scientific Calculator Casio fx-991ES", price:9500, cat:"Gadgets", seller:"Emeka N.", campus:"UNILAG", cond:"Good", note:"Works perfectly, extra battery", phone:"2348066677889"}
];

const SEED_EVENTS = [
  {id:"e1", title:"NACOS Tech Week: Hackathon", date:"2026-11-20", time:"10:00", venue:"Main Auditorium", desc:"48hr build challenge, prizes for top 3 teams. Bring your laptop.", price:"Free"},
  {id:"e2", title:"Chapel Thanksgiving Night", date:"2026-11-21", time:"18:00", venue:"Chapel", desc:"End of semester thanksgiving. Come with your testimony.", price:"Free"},
  {id:"e3", title:"Faculty Dinner & Awards", date:"2026-11-28", time:"17:00", venue:"Grand Hall", desc:"Dinner, awards, after party. Ticket includes food and photos.", price:"15000"},
  {id:"e4", title:"Career Fair 2026", date:"2026-12-03", time:"09:00", venue:"Sports Complex", desc:"Meet recruiters from banks, fintechs and tech companies. Bring CV.", price:"Free"}
];

const DEFAULT_TIMETABLE = [
  {day:"Monday", code:"MTH 201", title:"Advanced Algebra", from:"10:00", to:"11:30", venue:"LT"},
  {day:"Monday", code:"CMP 326", title:"Distributed Computing", from:"13:00", to:"14:30", venue:"Science Block 2"},
  {day:"Tuesday", code:"STA 201", title:"Statistics", from:"09:00", to:"10:30", venue:"LT"},
  {day:"Tuesday", code:"GST 201", title:"Philosophy & Logic", from:"11:00", to:"12:00", venue:"Arts Building"},
  {day:"Wednesday", code:"CMP 326", title:"Distributed Computing (Lab)", from:"10:00", to:"12:00", venue:"ICT Centre"},
  {day:"Thursday", code:"MTH 201", title:"Advanced Algebra (Tut)", from:"14:00", to:"15:00", venue:"Seminar Room 3"},
  {day:"Friday", code:"ENG 201", title:"Technical English", from:"09:00", to:"10:00", venue:"LT"}
];
