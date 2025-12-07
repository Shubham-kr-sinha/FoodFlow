const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodflow';
console.log('Connecting to:', uri);

mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB Connected');
        seedData();
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // Create a dummy owner if not exists
        let owner = await User.findOne({ email: 'owner@example.com' });
        if (!owner) {
            try {
                owner = await User.create({
                    name: 'Restaurant Owner',
                    email: 'owner@example.com',
                    password: 'password123', // In real app, hash this
                    role: 'restaurant_owner'
                });
            } catch (error) {
                if (error.code === 11000) {
                    console.log('Owner already exists, fetching...');
                    owner = await User.findOne({ email: 'owner@example.com' });
                } else {
                    throw error;
                }
            }
        }

        const restaurants = [
            // American / Burgers
            {
                name: "Burger King",
                description: "Home of the Whopper",
                address: { street: "Oberoi Mall, Goregaon East", city: "Mumbai", zip: "400063" },
                cuisine: ["American", "Burgers", "Fast Food"],
                image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.5,
                owner: owner._id,
                menu: [
                    { name: "Whopper", description: "Flame-grilled beef patty", price: 249, category: "Burgers", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Chicken Royale", description: "Crispy chicken breast", price: 219, category: "Burgers", image: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Fries", description: "Golden crispy fries", price: 119, category: "Sides", image: "https://images.unsplash.com/photo-1573080496987-a2f026fb9664?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Coke", description: "Chilled coca cola", price: 79, category: "Drinks", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            {
                name: "The Grill House",
                description: "Authentic American BBQ and Steaks",
                address: { street: "Indiranagar 100ft Road", city: "Bangalore", zip: "560038" },
                cuisine: ["American", "BBQ", "Steak"],
                image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.7,
                owner: owner._id,
                menu: [
                    { name: "Ribeye Steak", description: "12oz Prime Ribeye", price: 899, category: "Steak", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "BBQ Ribs", description: "Slow-cooked pork ribs", price: 749, category: "BBQ", image: "https://images.unsplash.com/photo-1544025162-d7669d620ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Mac & Cheese", description: "Creamy cheddar pasta", price: 349, category: "Sides", image: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Coleslaw", description: "Fresh cabbage slaw", price: 149, category: "Sides", image: "https://images.unsplash.com/photo-1625938145744-e38051539994?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            // Italian
            {
                name: "Pizza Hut",
                description: "Tastiest pizzas in town",
                address: { street: "Connaught Place, Block A", city: "New Delhi", zip: "110001" },
                cuisine: ["Italian", "Pizza"],
                image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.2,
                owner: owner._id,
                menu: [
                    { name: "Pepperoni Pizza", description: "Classic pepperoni", price: 499, category: "Pizza", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Veggie Supreme", description: "Loaded with vegetables", price: 549, category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Garlic Bread", description: "Buttery garlic bread", price: 189, category: "Sides", image: "https://images.unsplash.com/photo-1573140247632-f84660f67126?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Pasta Alfredo", description: "Creamy white sauce pasta", price: 399, category: "Pasta", image: "https://images.unsplash.com/photo-1626844131082-256783844137?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            {
                name: "Bella Napoli",
                description: "Authentic Neapolitan Pizza and Pasta",
                address: { street: "Koregaon Park", city: "Pune", zip: "411001" },
                cuisine: ["Italian", "Pasta", "Pizza"],
                image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.8,
                owner: owner._id,
                menu: [
                    { name: "Margherita", description: "San Marzano tomatoes, mozzarella, basil", price: 599, category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Spaghetti Carbonara", description: "Egg, cheese, pancetta, black pepper", price: 649, category: "Pasta", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Tiramisu", description: "Coffee-flavoured Italian dessert", price: 349, category: "Dessert", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Lasagna", description: "Layers of pasta, meat, and cheese", price: 699, category: "Pasta", image: "https://images.unsplash.com/photo-1574868468167-165bcadb296c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            // Japanese
            {
                name: "Sushi World",
                description: "Fresh sushi and sashimi",
                address: { street: "Cyber Hub, DLF Phase 2", city: "Gurgaon", zip: "122002" },
                cuisine: ["Japanese", "Sushi"],
                image: "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.8,
                owner: owner._id,
                menu: [
                    { name: "California Roll", description: "Crab, avocado, cucumber", price: 449, category: "Sushi", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Spicy Tuna Roll", description: "Tuna, spicy mayo", price: 499, category: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Miso Soup", description: "Traditional soybean soup", price: 199, category: "Soup", image: "https://images.unsplash.com/photo-1587327903249-a2982537455f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Sashimi Platter", description: "Assorted fresh raw fish", price: 999, category: "Sashimi", image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            {
                name: "Ramen Station",
                description: "Hot bowls of ramen",
                address: { street: "Bandra West, Hill Road", city: "Mumbai", zip: "400050" },
                cuisine: ["Japanese", "Ramen"],
                image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.6,
                owner: owner._id,
                menu: [
                    { name: "Tonkotsu Ramen", description: "Pork broth ramen", price: 549, category: "Ramen", image: "https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Shoyu Ramen", description: "Soy sauce base ramen", price: 499, category: "Ramen", image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Gyoza", description: "Pan-fried dumplings", price: 299, category: "Sides", image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Edamame", description: "Steamed soybeans", price: 249, category: "Sides", image: "https://images.unsplash.com/photo-1616428453479-7a726353d20a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            // Indian
            {
                name: "Spice Route",
                description: "A culinary journey through India",
                address: { street: "Park Street", city: "Kolkata", zip: "700016" },
                cuisine: ["Indian", "Curry"],
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                rating: 4.9,
                owner: owner._id,
                menu: [
                    { name: "Butter Chicken", description: "Creamy tomato chicken curry", price: 450, category: "Curry", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Garlic Naan", description: "Indian flatbread with garlic", price: 80, category: "Breads", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Paneer Tikka", description: "Grilled cottage cheese", price: 320, category: "Starters", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Biryani", description: "Spiced rice with chicken", price: 380, category: "Rice", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            {
                name: "Tandoori Nights",
                description: "Spicy tandoori delights",
                address: { street: "Sector 17 Market", city: "Chandigarh", zip: "160017" },
                cuisine: ["Indian", "Tandoori"],
                image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                rating: 4.4,
                owner: owner._id,
                menu: [
                    { name: "Chicken Tikka", description: "Grilled marinated chicken", price: 350, category: "Starters", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Dal Makhani", description: "Black lentils with cream", price: 280, category: "Curry", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Samosa", description: "Fried pastry with savory filling", price: 40, category: "Snacks", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Mango Lassi", description: "Yogurt based mango drink", price: 120, category: "Drinks", image: "https://images.unsplash.com/photo-1571167439003-4f9e16d47b6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            // Mexican
            {
                name: "Taco Fiesta",
                description: "Authentic Mexican Street Food",
                address: { street: "Jubilee Hills", city: "Hyderabad", zip: "500033" },
                cuisine: ["Mexican", "Tacos"],
                image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.5,
                owner: owner._id,
                menu: [
                    { name: "Beef Tacos", description: "Seasoned beef in soft shells", price: 199, category: "Tacos", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Chicken Quesadilla", description: "Grilled tortilla with cheese", price: 349, category: "Main", image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Guacamole & Chips", description: "Fresh avocado dip", price: 299, category: "Sides", image: "https://images.unsplash.com/photo-1599973877960-9e32a6946ce7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Churros", description: "Fried dough pastry", price: 189, category: "Dessert", image: "https://images.unsplash.com/photo-1624371414361-e670edf4898d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            {
                name: "El Camino",
                description: "Traditional Mexican Cuisine",
                address: { street: "Whitefield Main Road", city: "Bangalore", zip: "560066" },
                cuisine: ["Mexican", "Burritos"],
                image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.3,
                owner: owner._id,
                menu: [
                    { name: "Burrito Bowl", description: "Rice, beans, meat, veggies", price: 429, category: "Bowls", image: "https://images.unsplash.com/photo-1566740933-431526488d56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Nachos Supreme", description: "Chips with all toppings", price: 399, category: "Appetizers", image: "https://images.unsplash.com/photo-1582169296194-e90dd98207d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Enchiladas", description: "Tortillas rolled around meat", price: 459, category: "Main", image: "https://images.unsplash.com/photo-1534352956036-c01ac8432a42?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Horchata", description: "Sweet rice milk drink", price: 149, category: "Drinks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            // Chinese
            {
                name: "Dragon Wok",
                description: "Fiery Chinese Stir-fry",
                address: { street: "Tangra", city: "Kolkata", zip: "700046" },
                cuisine: ["Chinese", "Asian"],
                image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.1,
                owner: owner._id,
                menu: [
                    { name: "Kung Pao Chicken", description: "Spicy stir-fry with peanuts", price: 380, category: "Main", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Spring Rolls", description: "Crispy veggie rolls", price: 180, category: "Appetizers", image: "https://images.unsplash.com/photo-1544025162-d7669d620ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Fried Rice", description: "Wok-fried rice with veggies", price: 250, category: "Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb74b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Hot & Sour Soup", description: "Spicy and tangy soup", price: 160, category: "Soup", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            {
                name: "Dim Sum Delight",
                description: "Steamed goodness in baskets",
                address: { street: "Linking Road", city: "Mumbai", zip: "400052" },
                cuisine: ["Chinese", "Dim Sum"],
                image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.6,
                owner: owner._id,
                menu: [
                    { name: "Shrimp Dumplings", description: "Steamed crystal dumplings", price: 299, category: "Dim Sum", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Pork Buns", description: "Fluffy steamed buns", price: 249, category: "Dim Sum", image: "https://images.unsplash.com/photo-1563245372-f21720e32c4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Siu Mai", description: "Open-faced pork dumplings", price: 269, category: "Dim Sum", image: "https://images.unsplash.com/photo-1595295333158-6926b42c949c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Egg Tart", description: "Sweet custard pastry", price: 149, category: "Dessert", image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            // Mediterranean
            {
                name: "Greek Gyros",
                description: "Taste of the Mediterranean",
                address: { street: "Anjuna Beach Road", city: "Goa", zip: "403509" },
                cuisine: ["Greek", "Mediterranean"],
                image: "https://images.unsplash.com/photo-1560717845-968823efbee1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.7,
                owner: owner._id,
                menu: [
                    { name: "Chicken Gyro", description: "Pita wrap with tzatziki", price: 349, category: "Wraps", image: "https://images.unsplash.com/photo-1560717845-968823efbee1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Greek Salad", description: "Feta, olives, cucumber", price: 399, category: "Salad", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Falafel Platter", description: "Crispy chickpea balls", price: 449, category: "Platter", image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Baklava", description: "Sweet nut pastry", price: 249, category: "Dessert", image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            // Healthy
            {
                name: "Green Bowl",
                description: "Fresh and Organic Salad Bowls",
                address: { street: "Lavelle Road", city: "Bangalore", zip: "560001" },
                cuisine: ["Healthy", "Salad", "Vegan"],
                image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.8,
                owner: owner._id,
                menu: [
                    { name: "Quinoa Power Bowl", description: "Quinoa, avocado, kale", price: 499, category: "Bowls", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Berry Smoothie", description: "Mixed berries, yogurt", price: 249, category: "Drinks", image: "https://images.unsplash.com/photo-1553530666-ba11a90694f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Avocado Toast", description: "Whole grain toast, smashed avo", price: 349, category: "Toast", image: "https://images.unsplash.com/photo-1588137372308-15f75323ca8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Vegan Brownie", description: "Plant-based chocolate treat", price: 199, category: "Dessert", image: "https://images.unsplash.com/photo-1616031026078-62283ad0ca7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            },
            // Dessert
            {
                name: "Sweet Tooth",
                description: "Heavenly Desserts and Cakes",
                address: { street: "Khan Market", city: "New Delhi", zip: "110003" },
                cuisine: ["Dessert", "Bakery"],
                image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                rating: 4.9,
                owner: owner._id,
                menu: [
                    { name: "Chocolate Lava Cake", description: "Molten chocolate center", price: 299, category: "Cake", image: "https://images.unsplash.com/photo-1551024606-d1872120040e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Cheesecake", description: "New York style cheesecake", price: 329, category: "Cake", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Macarons", description: "Assorted French cookies", price: 499, category: "Box", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
                    { name: "Ice Cream Sundae", description: "3 scoops with toppings", price: 249, category: "Ice Cream", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
                ]
            }
        ];

        await Restaurant.deleteMany({}); // Clear existing
        await Restaurant.insertMany(restaurants);

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
