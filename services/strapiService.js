const axios = require('axios');

const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL;
const STRAPI_API_KEY = process.env.STRAPI_API_KEY;

const fetchItems = async (type) => {
    try {
        const response = await axios.get(`${STRAPI_BASE_URL}/${type}?populate=*`, {
            headers: { Authorization: `Bearer ${STRAPI_API_KEY}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${type} from Strapi:`, error);
        throw error;
    }
};

const fetchItemById = async (type, id) => {
    try {
        const response = await axios.get(`${STRAPI_BASE_URL}/${type}/${id}?populate=*`, {
            headers: { Authorization: `Bearer ${STRAPI_API_KEY}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${type} by ID from Strapi:`, error);
        throw error;
    }
};

// Define individual fetch functions for specific endpoints
const fetchAllAnnouncements = () => fetchItems('announcements');
const fetchAnnouncementById = (id) => fetchItemById('announcements', id);
const fetchAllPolls = () => fetchItems('polls');
const fetchPollById = (id) => fetchItemById('polls', id);
const fetchAllPosts = () => fetchItems('posts');
const fetchPostById = (id) => fetchItemById('posts', id);
const fetchAllCategories = () => fetchItems('categories');
const fetchAllImportantLinks = () => fetchItems('importantlinks'); // Newly added method for fetching all important links
const fetchImportantLinkById = (id) => fetchItemById('importantlinks', id); // Newly added method for fetching an important link by ID

// Using shorthand property names in the object
const strapiService = {
    fetchAllAnnouncements,
    fetchAnnouncementById,
    fetchAllPolls,
    fetchPollById,
    fetchAllPosts,
    fetchPostById,
    fetchAllCategories,
    fetchAllImportantLinks,  
    fetchImportantLinkById,  
};

module.exports = strapiService;
