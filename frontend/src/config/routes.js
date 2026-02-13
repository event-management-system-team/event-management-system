const ROUTES = {
    //Public 
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    EVENTS: '/events',
    EVENT_DETAILS: '/events/:id',

    // Organizer
    ORGANIZER_DASHBOARD: '/organizer/dashboard',
    CREATE_EVENT: '/organizer/events/create',
    MANAGE_FEEDBACK: '/organizer/events/:id/feedbacks',

    // Admin
    ADMIN_DASHBOARD: '/admin/dashboard',
};

export default ROUTES;