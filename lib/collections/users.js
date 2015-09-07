/**
 * This Users collection will hold a record for the authenticated user
 *  which represents the user's profile --- an ITicket in BacksideServlet.
 * If the user, by ID, is null, user is not authenticated.
 * If the user, by ID, is authenticated, it will be a JSON blob
 * BacksideServlet authenticates by email, so ID here is email
 */
Users = new Mongo.Collection('users');
