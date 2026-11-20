// Screens that still run on sample data (member Security/Billing/Privacy tabs,
// notification settings) are hidden unless NEXT_PUBLIC_SHOW_PREVIEW_FEATURES=true.
// Messages, Notifications and Fundraising are live.
export const SHOW_PREVIEW = process.env.NEXT_PUBLIC_SHOW_PREVIEW_FEATURES === 'true';

export const PRODUCT_NAME = 'AssociationOS';
