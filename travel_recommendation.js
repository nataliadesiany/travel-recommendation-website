let travelData = null;

const fallbackTravelData = {
    "countries": [
        {
            "id": 1,
            "name": "Australia",
            "cities": [
                {
                    "name": "Sydney, Australia",
                    "imageUrl": "images/sydney.jpg",
                    "description": "A vibrant city known for its iconic landmarks like the Sydney Opera House and Sydney Harbour Bridge."
                },
                {
                    "name": "Melbourne, Australia",
                    "imageUrl": "images/melbourne.jpg",
                    "description": "A cultural hub famous for its art, food, and diverse neighborhoods."
                }
            ]
        },
        {
            "id": 2,
            "name": "Japan",
            "cities": [
                {
                    "name": "Tokyo, Japan",
                    "imageUrl": "images/tokyo.jpg",
                    "description": "A bustling metropolis blending tradition and modernity, famous for its cherry blossoms and rich culture."
                },
                {
                    "name": "Kyoto, Japan",
                    "imageUrl": "images/kyoto.jpg",
                    "description": "Known for its historic temples, gardens, and traditional tea houses."
                }
            ]
        },
        {
            "id": 3,
            "name": "Brazil",
            "cities": [
                {
                    "name": "Rio de Janeiro, Brazil",
                    "imageUrl": "images/rio.jpg",
                    "description": "A lively city known for its stunning beaches, vibrant carnival celebrations, and iconic landmarks."
                },
                {
                    "name": "São Paulo, Brazil",
                    "imageUrl": "images/saopaulo.jpg",
                    "description": "The financial hub with diverse culture, arts, and a vibrant nightlife."
                }
            ]
        }
    ],
    "temples": [
        {
            "id": 1,
            "name": "Angkor Wat, Cambodia",
            "imageUrl": "images/angkorwat.jpg",
            "description": "A UNESCO World Heritage site and the largest religious monument in the world."
        },
        {
            "id": 2,
            "name": "Taj Mahal, India",
            "imageUrl": "images/taj mahal.jpg",
            "description": "An iconic symbol of love and a masterpiece of Mughal architecture."
        }
    ],
    "beaches": [
        {
            "id": 1,
           "name": "Bora Bora, French Polynesia",
           "imageUrl": "images/bora-bora.jpg",
           "description": "An island known for its stunning turquoise waters and luxurious overwater bungalows."
        },
        {
            "id": 2,
            "name": "Copacabana Beach, Brazil",
            "imageUrl": "images/copacabana.jpg",
            "description": "A famous beach in Rio de Janeiro, Brazil, with a vibrant atmosphere and stunning coastline."
        }
    ]
};

async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        travelData = await response.json();
        console.log('Travel data loaded successfully from JSON file');
        return travelData;
    } catch (error) {
        console.error('Error fetching travel data from JSON file:', error);
        console.log('Using fallback embedded data');
        travelData = fallbackTravelData;
        return travelData;
    }
}

async function displayAllRecommendations() {
    const grid = document.getElementById('recommendationsGrid');
    
    if (!grid) {
        console.error('Recommendations grid element not found');
        return;
    }
    
    if (!travelData) {
        await fetchTravelData();
    }
    
    if (!travelData) {
        console.error('No travel data available');
        return;
    }
    
    let html = '';
    
    travelData.countries.forEach(country => {
        country.cities.forEach(city => {
            html += createRecommendationCard(city);
        });
    });
    
    travelData.temples.forEach(temple => {
        html += createRecommendationCard(temple);
    });
    
    travelData.beaches.forEach(beach => {
        html += createRecommendationCard(beach);
    });
    
    if (html) {
        grid.innerHTML = html;
        console.log('All recommendations displayed successfully');
    } else {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; font-size: 1.2rem; color: #666;">No travel recommendations available.</p>';
        console.log('No recommendations found in data');
    }
}

function createRecommendationCard(item) {
    const imageUrl = item.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
    
    return `
        <div class="recommendation-card">
            <div class="card-image" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;">
                <div class="card-overlay">
                    <span class="location-pin">📍</span>
                </div>
            </div>
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <a href="#" class="visit-btn">Visit</a>
            </div>
        </div>
    `;
}

async function searchRecommendations() {
    const searchInput = document.getElementById('searchInput');
    const grid = document.getElementById('recommendationsGrid');
    
    if (!searchInput) {
        console.error('Search input element not found');
        alert('Search input not found. Please check the page.');
        return;
    }
    
    if (!grid) {
        console.error('Recommendations grid element not found');
        alert('Recommendations section not found. Please check the page.');
        return;
    }
    
    if (!travelData) {
        await fetchTravelData();
    }
    
    if (!travelData) {
        console.error('No travel data available for search');
        grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; font-size: 1.2rem; color: #666;">Unable to search. Please check that travel_recommendation_api.json is available.</p>';
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }
    
    console.log('Searching for:', searchTerm);
    
    let results = [];
    let html = '';
    
    const searchVariations = getSearchVariations(searchTerm);
    console.log('Search variations:', searchVariations);
    
    travelData.countries.forEach(country => {
        country.cities.forEach(city => {
            if (matchesSearch(city.name, city.description, searchVariations)) {
                results.push(city);
            }
        });
    });
    
    travelData.temples.forEach(temple => {
        if (matchesSearch(temple.name, temple.description, searchVariations)) {
            results.push(temple);
        }
    });
    
    travelData.beaches.forEach(beach => {
        if (matchesSearch(beach.name, beach.description, searchVariations)) {
            results.push(beach);
        }
    });
    
    console.log('Search results:', results);
    
    if (results.length > 0) {
        results.forEach(item => {
            html += createRecommendationCard(item);
        });
        grid.innerHTML = html;
        
        const recommendationsSection = document.getElementById('recommendations');
        if (recommendationsSection) {
            recommendationsSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; font-size: 1.2rem; color: #666; padding: 2rem;">No recommendations found for "' + searchTerm + '". Try searching for "beach", "temple", "Sydney", "Tokyo", or other destinations.</p>';
        
        const recommendationsSection = document.getElementById('recommendations');
        if (recommendationsSection) {
            recommendationsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function getSearchVariations(searchTerm) {
    const variations = [searchTerm];
    
    const keywordMap = {
        'beach': ['beach', 'beaches', 'coastal', 'seaside'],
        'beaches': ['beach', 'beaches', 'coastal', 'seaside'],
        'temple': ['temple', 'temples', 'religious', 'monument'],
        'temples': ['temple', 'temples', 'religious', 'monument'],
        'country': ['country', 'countries', 'nation'],
        'countries': ['country', 'countries', 'nation']
    };
    
    if (keywordMap[searchTerm]) {
        variations.push(...keywordMap[searchTerm]);
    }
    
    return variations;
}

function matchesSearch(name, description, searchVariations) {
    const nameWords = name.toLowerCase().split(' ');
    const descWords = description.toLowerCase().split(' ');
    const allText = name.toLowerCase() + ' ' + description.toLowerCase();
    
    return searchVariations.some(variation => {
        return allText.includes(variation) || 
               nameWords.some(word => word.includes(variation)) ||
               descWords.some(word => word.includes(variation));
    });
}

function clearResults() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    displayAllRecommendations();
    console.log('Search cleared, showing all recommendations');
}

function submitForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name && email && message) {
        alert(`Thank you ${name}! Your message has been submitted. We'll get back to you at ${email}.`);
        
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
    }
}

function displayTime() {
    const timeDisplay = document.getElementById('timeDisplay');
    const now = new Date();
    
    const timeZones = [
        { name: 'New York', timezone: 'America/New_York' },
        { name: 'Sydney', timezone: 'Australia/Sydney' },
        { name: 'Tokyo', timezone: 'Asia/Tokyo' }
    ];
    
    const randomTimeZone = timeZones[Math.floor(Math.random() * timeZones.length)];
    
    try {
        const timeString = now.toLocaleTimeString('en-US', {
            timeZone: randomTimeZone.timezone,
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        timeDisplay.innerHTML = `Current time in ${randomTimeZone.name}: ${timeString}`;
    } catch (error) {
        timeDisplay.innerHTML = `Current time: ${now.toLocaleTimeString()}`;
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupSearchOnEnter() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchRecommendations();
            }
        });
    }
}

function setupNavbarScroll() {
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    const searchInput = document.getElementById('searchInput');
    const grid = document.getElementById('recommendationsGrid');
    
    if (!searchInput) {
        console.error('Search input not found');
    }
    if (!grid) {
        console.error('Recommendations grid not found');
    }
    
    displayAllRecommendations();
    displayTime();
    setupSmoothScrolling();
    setupSearchOnEnter();
    setupNavbarScroll();
    
    setInterval(displayTime, 1000);
    
    console.log('Initialization complete');
});

window.addEventListener('resize', function() {
    console.log('Window resized');
});