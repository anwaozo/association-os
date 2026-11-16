// Screens that still run on sample data (Messages, Notifications, the
// Fundraising overview, payment and notification settings) are hidden unless
// NEXT_PUBLIC_SHOW_PREVIEW_FEATURES=true. They come back once their APIs exist.
export const SHOW_PREVIEW = process.env.NEXT_PUBLIC_SHOW_PREVIEW_FEATURES === 'true';

export const PRODUCT_NAME = 'AssociationOS';
